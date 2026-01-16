# Backend Setup & Testing Guide

## Prerequisites
- Node.js 20+
- Supabase account
- OpenAI API key

## Step 1: Project Structure

Create this folder structure:
```
backend/
├── src/
│   ├── config/
│   │   └── index.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── User.ts
│   │   │   ├── Document.ts
│   │   │   └── ChatSession.ts
│   │   └── repositories/
│   │       ├── IUserRepository.ts
│   │       ├── IDocumentRepository.ts
│   │       ├── IChunkRepository.ts
│   │       └── IChatRepository.ts
│   ├── application/
│   │   ├── dto/
│   │   │   ├── auth.dto.ts
│   │   │   ├── document.dto.ts
│   │   │   └── chat.dto.ts
│   │   ├── errors/
│   │   │   └── AppError.ts
│   │   └── use-cases/
│   │       ├── auth/
│   │       │   ├── RegisterUser.ts
│   │       │   └── LoginUser.ts
│   │       ├── documents/
│   │       │   ├── UploadDocument.ts
│   │       │   └── ProcessDocument.ts
│   │       └── chat/
│   │           └── SendMessage.ts
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── postgres.ts
│   │   │   └── repositories/
│   │   │       ├── PostgresUserRepository.ts
│   │   │       ├── PostgresDocumentRepository.ts
│   │   │       ├── PostgresChunkRepository.ts
│   │   │       └── PostgresChatRepository.ts
│   │   ├── services/
│   │   │   ├── OpenAIEmbeddingService.ts
│   │   │   ├── RecursiveChunkingService.ts
│   │   │   ├── SupabaseStorageService.ts
│   │   │   └── DocumentParserService.ts
│   │   └── external/
│   │       ├── supabase-client.ts
│   │       └── openai-client.ts
│   ├── interfaces/
│   │   └── http/
│   │       ├── controllers/
│   │       │   ├── AuthController.ts
│   │       │   ├── DocumentController.ts
│   │       │   └── ChatController.ts
│   │       ├── middleware/
│   │       │   ├── auth.middleware.ts
│   │       │   ├── error.middleware.ts
│   │       │   └── validation.middleware.ts
│   │       ├── routes/
│   │       │   ├── index.ts
│   │       │   ├── auth.routes.ts
│   │       │   ├── document.routes.ts
│   │       │   ├── chat.routes.ts
│   │       │   └── health.routes.ts
│   │       └── server.ts
│   ├── shared/
│   │   ├── logger.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   └── index.ts
├── tests/
│   ├── unit/
│   │   └── health.test.ts
│   └── setup.ts
├── .env
├── .env.example
├── .eslintrc.json
├── .gitignore
├── Dockerfile
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vitest.config.ts
```

## Step 2: Setup Supabase

### 2.1 Create Project
1. Go to https://supabase.com
2. Create new project
3. Wait for database to initialize

### 2.2 Run Database Setup
Copy this SQL into Supabase SQL Editor and run:

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing',
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);

-- Document chunks
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(3072),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_chunks_user_id ON document_chunks(user_id);
CREATE INDEX idx_chunks_embedding ON document_chunks 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Chat sessions
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON chat_sessions(user_id);

-- Chat messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    sources JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_session_id ON chat_messages(session_id);

-- User roles
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY documents_policy ON documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY chunks_policy ON document_chunks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY sessions_policy ON chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY messages_policy ON chat_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY roles_policy ON user_roles FOR SELECT USING (true);
```

### 2.3 Create Storage Bucket
1. Go to Storage in Supabase dashboard
2. Create bucket named `documents`
3. Set as Private
4. Add policy:
```sql
CREATE POLICY "Users manage own documents"
ON storage.objects FOR ALL
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 2.4 Get Credentials
From Supabase Project Settings → API:
- `SUPABASE_URL`: Project URL
- `SUPABASE_ANON_KEY`: anon/public key
- `SUPABASE_SERVICE_KEY`: service_role key

From Database Settings → Connection String:
- `DATABASE_URL`: Connection pooler URI (Transaction mode)

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

## Step 4: Configure Environment

Create `backend/.env`:
```bash
NODE_ENV=development
PORT=3000

# Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# JWT Secret (generate random 32+ chars)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Database (from Supabase Connection Pooler)
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Optional configs
RATE_LIMIT_MAX=100
RATE_LIMIT_TIMEWINDOW=60000
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
TOP_K_CHUNKS=5
EMBEDDING_MODEL=text-embedding-3-large
CHAT_MODEL=gpt-4-1106-preview
```

**CRITICAL**: Replace placeholders with your actual values.

## Step 5: Verify Installation

```bash
# Check TypeScript compiles
npm run build

# Should create dist/ folder with compiled JavaScript
```

## Step 6: Run Backend

```bash
npm run dev
```

Expected output:
```
{"level":30,"time":...,"msg":"Server listening on http://0.0.0.0:3000"}
```

## Step 7: Test Endpoints

### Health Check
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"...","uptime":...}
```

### Database Health
```bash
curl http://localhost:3000/health/db
# Expected: {"status":"ok","database":"connected"}
```

### Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Expected: {"user":{...},"accessToken":"...","refreshToken":"..."}
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Expected: {"user":{...},"accessToken":"...","refreshToken":"..."}
```

### Get Current User
```bash
# Replace YOUR_TOKEN with accessToken from login
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: {"user":{...}}
```

### Upload Document
```bash
# Create a test file
echo "This is test content" > test.txt

# Upload (replace YOUR_TOKEN)
curl -X POST http://localhost:3000/api/v1/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.txt"

# Expected: {"document":{...,"status":"processing"}}
```

### List Documents
```bash
curl http://localhost:3000/api/v1/documents \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: {"documents":[...],"total":1,"page":1,"limit":20}
```

## Step 8: Run Tests

```bash
npm test
```

## Troubleshooting

### "Configuration validation failed"
- Check all required env vars in `.env`
- Ensure no trailing spaces
- JWT_SECRET must be 32+ characters

### "Database connection failed"
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure connection pooler is used (port 6543)

### "Unauthorized" on API calls
- Check SUPABASE_SERVICE_KEY is correct
- Verify user was created (check Supabase Auth dashboard)
- Ensure JWT_SECRET matches

### "Module not found"
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, reinstall

### Port already in use
- Change PORT in `.env`
- Kill process on port 3000: `lsof -ti:3000 | xargs kill -9`

## Validation Checklist

- [ ] Dependencies installed
- [ ] Supabase database setup complete
- [ ] Storage bucket created
- [ ] `.env` configured with real values
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts server
- [ ] Health check responds
- [ ] Database health check responds
- [ ] Can register user
- [ ] Can login
- [ ] Can get current user
- [ ] Can upload document
- [ ] Can list documents

## Next Steps

Once all tests pass:
1. Verify document processing (wait 10-30s after upload, check status)
2. Test chat functionality
3. Move to frontend integration

## Quick Debug Commands

```bash
# View logs
npm run dev

# Check compiled output
npm run build && ls -la dist/

# Test specific endpoint
curl -v http://localhost:3000/health

# Check environment
node -e "console.log(process.env.DATABASE_URL)"
```
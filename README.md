# 🚀 RAG Platform - Production-Grade Document Chat

Enterprise-ready Retrieval-Augmented Generation platform for intelligent document interaction.

## 🎯 Features

- **Secure Authentication**: Supabase Auth with JWT
- **Document Management**: Upload PDF, DOCX, TXT files
- **Intelligent RAG**: OpenAI embeddings with pgvector similarity search
- **Real-time Chat**: Streaming responses with source citations
- **Multi-tenancy**: Complete user isolation with RLS
- **Production Ready**: Docker, CI/CD, monitoring, and GCP deployment

## 🏗️ Architecture

```
Frontend (Vue 3) → Backend (Fastify) → Supabase (Postgres + Storage)
                              ↓
                        OpenAI API
```

## 📦 Tech Stack

### Frontend
- Vue 3 + TypeScript + Vite
- TailwindCSS
- Pinia (State Management)
- Vue Router

### Backend
- Node.js + TypeScript
- Fastify
- Clean Architecture
- Zod Validation

### Infrastructure
- Supabase (Auth, Postgres, Storage, pgvector)
- OpenAI API (text-embedding-3-large, GPT-4.1)
- Docker + Docker Compose
- GitHub Actions CI/CD
- Google Cloud Platform (Cloud Run)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Supabase Account
- OpenAI API Key
- GCP Account (for production)

### 1. Clone Repository

```bash
git clone https://github.com/your-org/rag-platform.git
cd rag-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Create a new project at https://supabase.com
2. Run the setup script:

```bash
psql -h your-supabase-host -U postgres -d postgres -f infrastructure/scripts/setup-supabase.sql
```

3. Enable pgvector extension in SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 4. Configure Environment Variables

**Backend (.env)**

```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

**Frontend (.env)**

```bash
cd frontend
cp .env.example .env
# Edit .env with your values
```

### 5. Start Development Servers

**Option A: Using Docker Compose (Recommended)**

```bash
npm run docker:up
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

**Option B: Local Development**

```bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend
npm run frontend:dev
```

### 6. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/documentation

## 📚 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
cd backend && npm test

# Frontend tests only
cd frontend && npm test

# Coverage
npm run test:coverage
```

## 🏗️ Building for Production

```bash
# Build all services
npm run build

# Build Docker images
npm run docker:build
```

## 🚢 Deployment

### Deploy to GCP Cloud Run

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for complete guide.

```bash
# Setup GCP project
gcloud config set project YOUR_PROJECT_ID

# Deploy backend
cd backend
gcloud run deploy rag-backend --source .

# Deploy frontend
cd frontend
gcloud run deploy rag-frontend --source .
```

## 📊 Monitoring

- Cloud Run Metrics: GCP Console
- Application Logs: Structured JSON via Pino
- Error Tracking: Built-in error middleware

## 🔒 Security

- JWT Authentication
- Row Level Security (RLS)
- RBAC (Role-Based Access Control)
- Rate Limiting
- Input Validation (Zod)
- Secure Headers (Helmet)
- CORS Configuration



## 🏗️ GCP Infrastructure
```
┌─────────────────────────────────────────────────────────────────┐
│                      GCP RESOURCES                               │
└─────────────────────────────────────────────────────────────────┘

Project: rag-platform-production

Region: us-central1

Resources:
├─ Cloud Run Services
│  ├─ rag-backend-prod (3000)
│  │  ├─ Min instances: 1
│  │  ├─ Max instances: 100
│  │  ├─ CPU: 2
│  │  ├─ Memory: 2Gi
│  │  └─ Concurrency: 80
│  └─ rag-frontend-prod (8080)
│     ├─ Min instances: 1
│     ├─ Max instances: 50
│     ├─ CPU: 1
│     ├─ Memory: 512Mi
│     └─ Concurrency: 100
│
├─ Artifact Registry
│  └─ rag-platform-repo (Docker)
│
├─ Secret Manager
│  ├─ supabase-url
│  ├─ supabase-anon-key
│  ├─ supabase-service-key
│  ├─ openai-api-key
│  └─ jwt-secret
│
├─ Load Balancer
│  ├─ HTTPS (managed cert)
│  ├─ Backend: Cloud Run NEG
│  └─ CDN enabled
│
└─ Cloud Monitoring
   ├─ Uptime checks
   ├─ Log-based metrics
   └─ Alerting policies
```

---

# PHASE 1: MONOREPO & TOOLING

## 📁 Complete Folder Structure
```
rag-platform/
├─ .github/
│  └─ workflows/
│     ├─ backend-ci.yml
│     ├─ frontend-ci.yml
│     └─ deploy.yml
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  │  ├─ index.ts
│  │  │  ├─ database.ts
│  │  │  ├─ openai.ts
│  │  │  └─ supabase.ts
│  │  ├─ domain/
│  │  │  ├─ entities/
│  │  │  │  ├─ User.ts
│  │  │  │  ├─ Document.ts
│  │  │  │  ├─ DocumentChunk.ts
│  │  │  │  ├─ ChatSession.ts
│  │  │  │  └─ ChatMessage.ts
│  │  │  ├─ repositories/
│  │  │  │  ├─ IDocumentRepository.ts
│  │  │  │  ├─ IChunkRepository.ts
│  │  │  │  ├─ IChatRepository.ts
│  │  │  │  └─ IUserRepository.ts
│  │  │  └─ services/
│  │  │     ├─ IEmbeddingService.ts
│  │  │     ├─ IChunkingService.ts
│  │  │     └─ IStorageService.ts
│  │  ├─ application/
│  │  │  ├─ dto/
│  │  │  │  ├─ auth.dto.ts
│  │  │  │  ├─ document.dto.ts
│  │  │  │  └─ chat.dto.ts
│  │  │  ├─ use-cases/
│  │  │  │  ├─ auth/
│  │  │  │  │  ├─ RegisterUser.ts
│  │  │  │  │  ├─ LoginUser.ts
│  │  │  │  │  └─ GetCurrentUser.ts
│  │  │  │  ├─ documents/
│  │  │  │  │  ├─ UploadDocument.ts
│  │  │  │  │  ├─ ProcessDocument.ts
│  │  │  │  │  ├─ GetDocuments.ts
│  │  │  │  │  ├─ GetDocument.ts
│  │  │  │  │  └─ DeleteDocument.ts
│  │  │  │  └─ chat/
│  │  │  │     ├─ CreateSession.ts
│  │  │  │     ├─ GetSessions.ts
│  │  │  │     ├─ GetMessages.ts
│  │  │  │     ├─ SendMessage.ts
│  │  │  │     └─ DeleteSession.ts
│  │  │  └─ errors/
│  │  │     ├─ AppError.ts
│  │  │     ├─ ValidationError.ts
│  │  │     ├─ UnauthorizedError.ts
│  │  │     └─ NotFoundError.ts
│  │  ├─ infrastructure/
│  │  │  ├─ database/
│  │  │  │  ├─ postgres.ts
│  │  │  │  └─ repositories/
│  │  │  │     ├─ PostgresDocumentRepository.ts
│  │  │  │     ├─ PostgresChunkRepository.ts
│  │  │  │     ├─ PostgresChatRepository.ts
│  │  │  │     └─ PostgresUserRepository.ts
│  │  │  ├─ services/
│  │  │  │  ├─ OpenAIEmbeddingService.ts
│  │  │  │  ├─ RecursiveChunkingService.ts
│  │  │  │  ├─ SupabaseStorageService.ts
│  │  │  │  └─ DocumentParserService.ts
│  │  │  └─ external/
│  │  │     ├─ openai-client.ts
│  │  │     └─ supabase-client.ts
│  │  ├─ interfaces/
│  │  │  ├─ http/
│  │  │  │  ├─ server.ts
│  │  │  │  ├─ routes/
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ auth.routes.ts
│  │  │  │  │  ├─ document.routes.ts
│  │  │  │  │  ├─ chat.routes.ts
│  │  │  │  │  └─ health.routes.ts
│  │  │  │  ├─ controllers/
│  │  │  │  │  ├─ AuthController.ts
│  │  │  │  │  ├─ DocumentController.ts
│  │  │  │  │  └─ ChatController.ts
│  │  │  │  └─ middleware/
│  │  │  │     ├─ auth.middleware.ts
│  │  │  │     ├─ rbac.middleware.ts
│  │  │  │     ├─ error.middleware.ts
│  │  │  │     ├─ validation.middleware.ts
│  │  │  │     ├─ rate-limit.middleware.ts
│  │  │  │     └─ logging.middleware.ts
│  │  │  └─ workers/
│  │  │     └─ document-processor.worker.ts
│  │  ├─ shared/
│  │  │  ├─ logger.ts
│  │  │  ├─ utils.ts
│  │  │  └─ constants.ts
│  │  └─ index.ts
│  ├─ tests/
│  │  ├─ unit/
│  │  │  ├─ use-cases/
│  │  │  ├─ services/
│  │  │  └─ repositories/
│  │  ├─ integration/
│  │  │  └─ api/
│  │  └─ setup.ts
│  ├─ .env.example
│  ├─ .eslintrc.json
│  ├─ .gitignore
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ vitest.config.ts
├─ frontend/
│  ├─ public/
│  │  └─ favicon.ico
│  ├─ src/
│  │  ├─ assets/
│  │  │  └─ styles/
│  │  │     └─ main.css
│  │  ├─ components/
│  │  │  ├─ common/
│  │  │  │  ├─ AppButton.vue
│  │  │  │  ├─ AppInput.vue
│  │  │  │  ├─ AppModal.vue
│  │  │  │  ├─ AppSpinner.vue
│  │  │  │  └─ AppToast.vue
│  │  │  ├─ auth/
│  │  │  │  ├─ LoginForm.vue
│  │  │  │  └─ RegisterForm.vue
│  │  │  ├─ documents/
│  │  │  │  ├─ DocumentList.vue
│  │  │  │  ├─ DocumentCard.vue
│  │  │  │  └─ DocumentUpload.vue
│  │  │  └─ chat/
│  │  │     ├─ ChatSidebar.vue
│  │  │     ├─ ChatWindow.vue
│  │  │     ├─ MessageList.vue
│  │  │     ├─ MessageItem.vue
│  │  │     └─ ChatInput.vue
│  │  ├─ composables/
│  │  │  ├─ useAuth.ts
│  │  │  ├─ useDocuments.ts
│  │  │  ├─ useChat.ts
│  │  │  └─ useToast.ts
│  │  ├─ layouts/
│  │  │  ├─ DefaultLayout.vue
│  │  │  └─ AuthLayout.vue
│  │  ├─ router/
│  │  │  ├─ index.ts
│  │  │  └─ guards.ts
│  │  ├─ services/
│  │  │  ├─ api.service.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ document.service.ts
│  │  │  └─ chat.service.ts
│  │  ├─ stores/
│  │  │  ├─ auth.store.ts
│  │  │  ├─ document.store.ts
│  │  │  ├─ chat.store.ts
│  │  │  └─ toast.store.ts
│  │  ├─ types/
│  │  │  ├─ auth.types.ts
│  │  │  ├─ document.types.ts
│  │  │  └─ chat.types.ts
│  │  ├─ views/
│  │  │  ├─ LoginView.vue
│  │  │  ├─ RegisterView.vue
│  │  │  ├─ DocumentsView.vue
│  │  │  └─ ChatView.vue
│  │  ├─ App.vue
│  │  ├─ main.ts
│  │  └─ env.d.ts
│  ├─ tests/
│  │  ├─ unit/
│  │  │  ├─ components/
│  │  │  └─ stores/
│  │  └─ setup.ts
│  ├─ .env.example
│  ├─ .eslintrc.json
│  ├─ .gitignore
│  ├─ Dockerfile
│  ├─ index.html
│  ├─ package.json
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ vite.config.ts
│  └─ vitest.config.ts
├─ infrastructure/
│  ├─ terraform/
│  │  ├─ main.tf
│  │  ├─ variables.tf
│  │  ├─ outputs.tf
│  │  └─ backend.tf
│  ├─ kubernetes/
│  │  └─ (optional for future)
│  └─ scripts/
│     ├─ setup-supabase.sql
│     ├─ deploy.sh
│     └─ rollback.sh
├─ docs/
│  ├─ API.md
│  ├─ ARCHITECTURE.md
│  ├─ DEPLOYMENT.md
│  └─ DEVELOPMENT.md
├─ .gitignore
├─ .dockerignore
├─ docker-compose.yml
├─ package.json (root)
├─ turbo.json
└─ README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request



## 🆘 Support

- Documentation: [docs/](./docs/)
- Issues: GitHub Issues
- Email: reachhasaan@gmail.com

---

Built with ❤️ 
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
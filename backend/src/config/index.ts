import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3000),
  
  supabase: z.object({
    url: z.string().url(),
    anonKey: z.string().min(1),
    serviceKey: z.string().min(1),
  }),
  
  openai: z.object({
    apiKey: z.string().min(1),
    embeddingModel: z.string().default('text-embedding-3-large'),
    chatModel: z.string().default('gpt-4-1106-preview'),
  }),
  
  database: z.object({
    url: z.string().url(),
  }),
  
  jwt: z.object({
    secret: z.string().min(32),
  }),
  
  rateLimit: z.object({
    max: z.coerce.number().default(100),
    timeWindow: z.coerce.number().default(60000),
  }),
  
  upload: z.object({
    maxFileSize: z.coerce.number().default(10485760), // 10MB
    allowedTypes: z.string().default('application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'),
  }),
  
  chunking: z.object({
    chunkSize: z.coerce.number().default(1000),
    chunkOverlap: z.coerce.number().default(200),
  }),
  
  rag: z.object({
    topK: z.coerce.number().default(5),
  }),
});

const parseConfig = () => {
  const rawConfig = {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    
    supabase: {
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
      serviceKey: process.env.SUPABASE_SERVICE_KEY,
    },
    
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      embeddingModel: process.env.EMBEDDING_MODEL,
      chatModel: process.env.CHAT_MODEL,
    },
    
    database: {
      url: process.env.DATABASE_URL,
    },
    
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    
    rateLimit: {
      max: process.env.RATE_LIMIT_MAX,
      timeWindow: process.env.RATE_LIMIT_TIMEWINDOW,
    },
    
    upload: {
      maxFileSize: process.env.MAX_FILE_SIZE,
      allowedTypes: process.env.ALLOWED_FILE_TYPES,
    },
    
    chunking: {
      chunkSize: process.env.CHUNK_SIZE,
      chunkOverlap: process.env.CHUNK_OVERLAP,
    },
    
    rag: {
      topK: process.env.TOP_K_CHUNKS,
    },
  };
  
  try {
    return configSchema.parse(rawConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => e.path.join('.')).join(', ');
      throw new Error(`Configuration validation failed. Missing or invalid: ${missingVars}`);
    }
    throw error;
  }
};

export const config = parseConfig();

export default config;
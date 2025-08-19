import { cors } from 'hono/cors';

export const corsMiddleware = cors({
  origin: [
    'http://localhost:8080', 
    'http://127.0.0.1:8080', 
    'http://localhost:3001',
    'http://localhost:5173',
    "*"
  ],
  credentials: true,
}); 
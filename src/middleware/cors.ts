import { cors } from 'hono/cors';

export const corsMiddleware = cors({
  origin: [
    "https://siwe-ui.pages.dev",
    "https://siwe-ui.pages.dev/*"
  ],
  credentials: true,
}); 
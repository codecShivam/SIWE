import type { Context, Next } from 'hono';
import { cookieManager } from '../utils/cookies';

export const authMiddleware = async (c: Context, next: Next) => {
  const isAuthenticated = cookieManager.isAuthenticated(c);
  const userAddress = cookieManager.getUserAddress(c);
  
  if (!isAuthenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  c.set('userAddress', userAddress);
  await next();
}; 
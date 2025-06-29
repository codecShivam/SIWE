import { Hono } from 'hono';
import type { ProtectedResponse } from '../types/auth';
import { authMiddleware } from '../middleware';

const protectedRoutes = new Hono();

protectedRoutes.use('*', authMiddleware); 

protectedRoutes.get('/profile', (c) => {
  const userAddress = (c as any).get('userAddress') as string;
  
  const response: ProtectedResponse = {
    message: 'User profile data',
    address: userAddress
  };
  
  return c.json(response);
});



export default protectedRoutes; 
import { Hono } from 'hono';
import { db } from '../db/connection';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware';

const protectedRoutes = new Hono();

protectedRoutes.use('*', authMiddleware); 

protectedRoutes.get('/profile', async (c) => {
  const userAddress = (c as any).get('userAddress') as string;
  
  // Get full user data from database
  const user = await db
    .select()
    .from(users)
    .where(eq(users.walletAddress, userAddress))
    .limit(1);
  
  if (user.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  const userData = user[0];
  
  const response = {
    message: 'User profile data from database',
    address: userData.walletAddress,
    userId: userData.id,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt
  };
  
  return c.json(response);
});



export default protectedRoutes; 
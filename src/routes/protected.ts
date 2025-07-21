import { Hono } from 'hono';
import { db } from '../db/connection';
import { users, profiles } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware';

const protectedRoutes = new Hono();

protectedRoutes.use('*', authMiddleware); 

protectedRoutes.get('/profile', async (c) => {
  const userAddress = (c as any).get('userAddress') as string;
  
  const result = await db
    .select({
      userId: users.id,
      walletAddress: users.walletAddress,
      userCreatedAt: users.createdAt,
      name: profiles.name,
      email: profiles.email,
      avatar: profiles.avatar,
      profileCreatedAt: profiles.createdAt,
      profileUpdatedAt: profiles.updatedAt,
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.walletAddress, userAddress))
    .limit(1);
  
  if (result.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  const data = result[0];
  
  const response = {
    user: {
      id: data.userId,
      walletAddress: data.walletAddress,
      createdAt: data.userCreatedAt,
    },
    profile: data.name || data.email || data.avatar ? {
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      createdAt: data.profileCreatedAt,
      updatedAt: data.profileUpdatedAt,
    } : null
  };
  
  return c.json(response);
});

protectedRoutes.post('/profile', async (c) => {
  const userAddress = (c as any).get('userAddress') as string;
  
  try {
    const { name, email, avatar } = await c.req.json();
    
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.walletAddress, userAddress))
      .limit(1);
    
    if (user.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    const userId = user[0].id;
    
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);
    
    if (existingProfile.length > 0) {
      const updatedProfile = await db
        .update(profiles)
        .set({
          name: name || null,
          email: email || null,
          avatar: avatar || null,
        })
        .where(eq(profiles.userId, userId))
        .returning();
      
      return c.json({
        message: 'Profile updated successfully',
        profile: updatedProfile[0]
      });
    } else {
      const newProfile = await db
        .insert(profiles)
        .values({
          userId,
          name: name || null,
          email: email || null,
          avatar: avatar || null,
        })
        .returning();
      
      return c.json({
        message: 'Profile created successfully',
        profile: newProfile[0]
      });
    }
  } catch (error) {
    console.error('Profile creation/update error:', error);
    return c.json({ error: 'Failed to save profile' }, 500);
  }
});

protectedRoutes.delete('/profile', async (c) => {
  const userAddress = (c as any).get('userAddress') as string;
  
  try {
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.walletAddress, userAddress))
      .limit(1);
    
    if (user.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    const userId = user[0].id;

    const deletedProfile = await db
      .delete(profiles)
      .where(eq(profiles.userId, userId))
      .returning();
    
    if (deletedProfile.length === 0) {
      return c.json({ error: 'No profile found to delete' }, 404);
    }
    
    return c.json({
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Profile deletion error:', error);
    return c.json({ error: 'Failed to delete profile' }, 500);
  }
});

export default protectedRoutes; 
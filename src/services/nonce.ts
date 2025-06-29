import { randomBytes } from 'crypto';
import { db } from '../db/connection';
import { sessions } from '../db/schema';
import { eq, lt } from 'drizzle-orm';
import type { NonceData } from '../types/auth';

class NonceService {
  async generateNonce(): Promise<{ nonce: string; sessionId: string }> {
    try {
      const nonce = randomBytes(32).toString('hex');
      const sessionId = randomBytes(16).toString('hex');
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      
      await db.insert(sessions).values({
        sessionId,
        nonce,
        expiresAt,
      });
      
      return { nonce, sessionId };
    } catch (error) {   
      throw new Error('Database connection failed');
    }
  }

  async getNonce(sessionId: string): Promise<NonceData | undefined> {
    
    const result = await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionId, sessionId))
      .limit(1);
    
    if (result.length === 0) {
      return undefined;
    }
    
    const session = result[0];
    
    return {
      nonce: session.nonce,
      timestamp: session.createdAt!.getTime(),
    };
  }

  async removeNonce(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.sessionId, sessionId));
  }

  async cleanupExpiredNonces(): Promise<void> {
    await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
  }

  startCleanupInterval(): void {
    // Clean up expired nonces every 5 minutes
    setInterval(async () => {
      await this.cleanupExpiredNonces();
    }, 5 * 60 * 1000);
  }
}

export const nonceService = new NonceService(); 
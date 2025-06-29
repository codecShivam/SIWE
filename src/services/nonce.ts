import { randomBytes } from 'crypto';
import type { NonceData } from '../types/auth';

class NonceService {
  private nonceStore = new Map<string, NonceData>();

  generateNonce(): { nonce: string; sessionId: string } {
    const nonce = randomBytes(32).toString('hex');
    const sessionId = randomBytes(16).toString('hex');
    
    this.nonceStore.set(sessionId, {
      nonce,
      timestamp: Date.now()
    });
    
    return { nonce, sessionId };
  }

  getNonce(sessionId: string): NonceData | undefined {
    return this.nonceStore.get(sessionId);
  }

  removeNonce(sessionId: string): void {
    this.nonceStore.delete(sessionId);
  }

  cleanupExpiredNonces(): void {
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;
    
    for (const [key, value] of this.nonceStore.entries()) {
      if (value.timestamp < tenMinutesAgo) {
        this.nonceStore.delete(key);
      }
    }
  }

  startCleanupInterval(): void {
    // Clean up expired nonces every 5 minutes
    setInterval(() => {
      this.cleanupExpiredNonces();
    }, 5 * 60 * 1000);
  }
}

export const nonceService = new NonceService(); 
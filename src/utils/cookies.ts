import type { Context } from 'hono';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  domain?: string;
  path?: string;
}

class CookieManager {
  private getDefaultOptions(): CookieOptions {
    return {
      httpOnly: false, // Change to false temporarily for debugging
      secure: true, // Keep true for HTTPS
      sameSite: 'none', // Required for cross-origin
      path: '/',
    };
  }

  setSessionCookie(c: Context, sessionId: string): void {
    const options = {
      ...this.getDefaultOptions(),
      maxAge: 10 * 60 // 10 minutes
    };
    
    console.log('🔍 Setting session cookie with options:', options);
    setCookie(c, 'sessionId', sessionId, options);
  }

  setAuthCookies(c: Context, userAddress: string): void {
    const options = {
      ...this.getDefaultOptions(),
      maxAge: 24 * 60 * 60 // 24 hours
    };

    setCookie(c, 'authenticated', 'true', options);
    setCookie(c, 'userAddress', userAddress, options);
  }

  clearAuthCookies(c: Context): void {
    deleteCookie(c, 'authenticated');
    deleteCookie(c, 'userAddress');
    deleteCookie(c, 'sessionId');
  }

  getSessionId(c: Context): string | null {
    const sessionId = getCookie(c, 'sessionId') || null;
    console.log('🔍 Getting sessionId from cookie:', sessionId);
    return sessionId;
  }

  getUserAddress(c: Context): string | null {
    return getCookie(c, 'userAddress') || null;
  }

  isAuthenticated(c: Context): boolean {
    return getCookie(c, 'authenticated') === 'true';
  }
}

export const cookieManager = new CookieManager(); 
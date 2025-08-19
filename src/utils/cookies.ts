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
      httpOnly: true, // Change to false temporarily for debugging
      secure: true, // Keep true for HTTPS
      sameSite: 'none', 
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
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
      path: '/',
      maxAge: 0, // This expires the cookie immediately
    };

    // Set cookies with maxAge: 0 to expire them
    setCookie(c, 'authenticated', '', options);
    setCookie(c, 'userAddress', '', options);
    setCookie(c, 'sessionId', '', options);
    
    console.log('🔍 Clearing all auth cookies');
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
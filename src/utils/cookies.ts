import type { Context } from 'hono';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
}

class CookieManager {
  private getDefaultOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    };
  }

  setSessionCookie(c: Context, sessionId: string): void {
    setCookie(c, 'sessionId', sessionId, {
      ...this.getDefaultOptions(),
      maxAge: 10 * 60 // 10 minutes
    });
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
    return getCookie(c, 'sessionId') || null;
  }

  getUserAddress(c: Context): string | null {
    return getCookie(c, 'userAddress') || null;
  }

  isAuthenticated(c: Context): boolean {
    return getCookie(c, 'authenticated') === 'true';
  }
}

export const cookieManager = new CookieManager(); 
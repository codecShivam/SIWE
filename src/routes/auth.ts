import { Hono } from 'hono';
import { nonceService } from '../services/nonce';
import { authService } from '../services/auth';
import { cookieManager } from '../utils/cookies';
import type { AuthRequest, AuthStatus } from '../types/auth';

const authRoutes = new Hono();

// Generate nonce endpoint
authRoutes.get('/nonce', async (c) => {
  try {
    const { nonce, sessionId } = await nonceService.generateNonce();
    
    console.log('🔍 Setting session cookie:', sessionId);
    cookieManager.setSessionCookie(c, sessionId);
    
    // Debug: Log all response headers
    console.log('🔍 Response headers:', Object.fromEntries(c.res.headers.entries()));
    
    return c.text(nonce);
  } catch (error) {
    console.error('❌ Nonce generation error:', error);
    return c.json({ error: 'Failed to generate nonce' }, 500);
  }
});

// Verify message and authenticate
authRoutes.post('/verify', async (c) => {
  try {
    // Debug: Log all incoming headers and cookies
    const headerEntries = Array.from(c.req.raw.headers.entries());
    console.log('🔍 Incoming request headers:', Object.fromEntries(headerEntries));
    console.log('🔍 Cookie header:', c.req.header('cookie'));
    
    const authRequest: AuthRequest = await c.req.json();
    const sessionId = cookieManager.getSessionId(c);
    
    console.log('🔍 Retrieved sessionId from cookie:', sessionId);

    if (!sessionId) {
      console.log('❌ No session found in cookies');
      return c.json({ error: 'No session found' }, 401);
    }

    const authResult = await authService.verifyAuthentication(authRequest, sessionId);
    
    cookieManager.setAuthCookies(c, authResult.address);
    
    return c.json(authResult);
  } catch (error) {
    console.error('❌ Verify error:', error);
    
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ error: 'Failed to verify message' }, 500);
  }
});

// Logout endpoint
authRoutes.post('/logout', (c) => {
  try {
    cookieManager.clearAuthCookies(c);
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to logout' }, 500);
  }
});

// Check authentication status
authRoutes.get('/status', (c) => {
  const isAuthenticated = cookieManager.isAuthenticated(c);
  const userAddress = cookieManager.getUserAddress(c);
  
  const authStatus: AuthStatus = {
    authenticated: isAuthenticated,
    address: userAddress
  };
  
  return c.json(authStatus);
});


export default authRoutes; 
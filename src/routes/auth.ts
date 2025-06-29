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
    
    cookieManager.setSessionCookie(c, sessionId);
    
    return c.text(nonce);
  } catch (error) {
    console.error('Error generating nonce:', error);
    return c.json({ error: 'Failed to generate nonce' }, 500);
  }
});

// Verify message and authenticate
authRoutes.post('/verify', async (c) => {
  try {
    const authRequest: AuthRequest = await c.req.json();
    const sessionId = cookieManager.getSessionId(c);
    
    if (!sessionId) {
      return c.json({ error: 'No session found' }, 401);
    }

    const authResult = await authService.verifyAuthentication(authRequest, sessionId);
    
    cookieManager.setAuthCookies(c, authResult.address);
    
    return c.json(authResult);
  } catch (error) {
    console.error('Error verifying message:', error);
    
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
    console.error('Error during logout:', error);
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
import { verifyMessage } from 'viem';
import { parseSiweMessage } from 'viem/siwe';
import { nonceService } from './nonce';
import type { AuthRequest, AuthResponse } from '../types/auth';

class AuthService {
  async verifyAuthentication(
    authRequest: AuthRequest,
    sessionId: string
  ): Promise<AuthResponse> {
    const { message, signature } = authRequest;

    if (!message || !signature) {
      throw new Error('Missing message or signature');
    }

    if (!sessionId) {
      throw new Error('No session found');
    }

    // Get stored nonce
    const storedData = nonceService.getNonce(sessionId);
    if (!storedData) {
      throw new Error('Invalid or expired nonce');
    }

    // Parse the SIWE message
    const parsedMessage = parseSiweMessage(message);

    // Verify the nonce matches
    if (parsedMessage.nonce !== storedData.nonce) {
      throw new Error('Invalid nonce');
    }

    // Check if address exists
    if (!parsedMessage.address) {
      throw new Error('Invalid message: missing address');
    }

    // Verify the signature
    const isValid = await verifyMessage({
      address: parsedMessage.address,
      message,
      signature: signature as `0x${string}`
    });

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    // Clean up used nonce
    nonceService.removeNonce(sessionId);

    return {
      success: true,
      address: parsedMessage.address
    };
  }
}

export const authService = new AuthService(); 
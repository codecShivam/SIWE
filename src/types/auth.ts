export interface NonceData {
  nonce: string;
  timestamp: number;
}

export interface AuthRequest {
  message: string;
  signature: string;
}

export interface AuthResponse {
  success: boolean;
  address: string;
}

export interface AuthStatus {
  authenticated: boolean;
  address: string | null;
}

export interface ProtectedResponse {
  message: string;
  address: string | null;
} 
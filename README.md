# EVM Wallet Authentication API

Backend API for wallet authentication using SIWE (Sign-In with Ethereum).

## 🚀 Quick Start

```bash
bun install
bun dev
# API runs on http://localhost:8080
```

## 📡 API Endpoints

### Health
- `GET /api/health` - Check API status

### Authentication  
- `GET /api/auth/nonce` - Get authentication nonce
- `POST /api/auth/verify` - Verify wallet signature
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/status` - Check auth status

### Protected Routes (Requires Auth)
- `GET /api/a/profile` - User profile

## 🔧 How It Works

1. Get nonce from `/auth/nonce`
2. Sign message with wallet
3. Send signature to `/auth/verify`  
4. Access protected routes under `/a/*`

## 🛡️ Security

- SIWE message verification
- HTTP-only cookies
- Session management

## 📦 Tech Stack

- **Framework**: Hono.js
- **Runtime**: Bun

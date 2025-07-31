# EVM Wallet Authentication API

Backend API for wallet authentication using SIWE (Sign-In with Ethereum).

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start PostgreSQL database
docker-compose up -d

# Generate database migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Start development server
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
- `GET /api/a/profile` - User profile data

## 🔧 How It Works

1. Get nonce from `/api/auth/nonce`
2. Sign message with wallet
3. Send signature to `/api/auth/verify` 
4. Access protected routes under `/api/a/*` 

## 🗄️ Database Setup

### Environment Variables
Create a `.env` file:
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/evm_wallet  # your db url
PORT=8080
```

### Database Commands
```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Generate migration files
bun run db:generate

# Apply migrations to database
bun run db:migrate

# Open database GUI (optional)
bun run db:studio
```

## 🛡️ Security

- SIWE message verification
- HTTP-only cookies
- Persistent session management with PostgreSQL
- Database-backed user authentication

## 📦 Tech Stack

- **Framework**: Hono.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Crypto**: Viem  
- **Runtime**: Bun

### Integration template: 
https://github.com/codecShivam/SIWE-ui

# DevSamurai Auth System

A full-stack authentication system built with NestJS backend and React frontend, featuring JWT authentication with refresh token support.

## 🚀 Features

- **Authentication System**
  - User signup/signin with email & password
  - JWT access tokens
  - Secure password hashing with Argon2
  - Logout functionality

- **Backend (NestJS)**
  - RESTful API with proper validation
  - PostgreSQL database with Prisma ORM
  - JWT strategy with Passport
  - Global CORS configuration
  - Error handling & validation pipes

- **Frontend (React + TypeScript)**
  - Modern React with Vite
  - Tailwind CSS + ShadCN UI components
  - React Hook Form + Zod validation
  - Redux Toolkit for state management
  - Axios interceptors for auto token refresh
  - Protected routes

## 📁 Project Structure

```
devsamurai/
├── src/                          # Backend (NestJS)
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   ├── auth.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── strategy/
│   │   │   └── jwt.strategy.ts
│   │   └── decorator/
│   │       └── get-user.decorator.ts
│   ├── user/
│   │   ├── user.controller.ts
│   │   └── user.module.ts
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
└── README.md
```

## 🛠 Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- Git

### Backend Setup

1. **Clone the repository**
3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   Create `.env` in root folder
   Update `.env` with  credentials:
   ```env
   DATABASE_URL="postgresql://postgres:123@localhost:5434/nest?schema=public"
   JWT_SECRET=super-secret-key-minimum-32-characters-long
   JWT_REFRESH_SECRET=super-secret-refresh-key-minimum-32-characters-long-different-from-jwt-secret  
   ```
  
5. **Run docker container**
   ```bash
   docker compose up -d
   ```
7. **Database setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma migrate dev
   ```

8. **Start the backend**
   ```bash
   npm run start:dev
   ```
   
   Backend will be running on `http://localhost:3000`


## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Register new user | `{ email, password }` |
| POST | `/auth/signin` | Login user | `{ email, password }` |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user info | ✅ |

### Example API Calls

**Signup**
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Get User Info**
```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer <access_token>"
```


```tsx
// Login Form
<button data-testid="login-btn" type="submit">
  Sign In
</button>

// Signup Form  
<button data-testid="signup-btn" type="submit">
  Create Account
</button>

// Dashboard
<button data-testid="logout-btn" onClick={handleLogout}>
  Logout
</button>

// Protected Content
<div data-testid="user-profile">
  {user?.email}
</div>
```


## 📝 Available Scripts

### Backend
- `npm run start:dev` - Start development server with hot reload

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Backend framework
- [Prisma](https://prisma.io/) - Database ORM
- [ShadCN UI](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**Built with ❤️ for DevSamurai Interview**

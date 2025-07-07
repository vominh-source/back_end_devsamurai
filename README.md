# DevSamurai Auth System

A full-stack authentication system built with NestJS backend and React frontend, featuring JWT authentication with refresh token support.

## 🚀 Features

- **Authentication System**
  - User signup/signin with email & password
  - JWT access tokens (15 minutes) + refresh tokens (7 days)
  - Secure password hashing with Argon2
  - Token refresh mechanism
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
├── frontend/                     # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🛠 Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devsamurai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/devsamurai_db"
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters-long
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   ```

5. **Start the backend**
   ```bash
   npm run start:dev
   ```
   
   Backend will be running on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend**
   ```bash
   npm run dev
   ```
   
   Frontend will be running on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Register new user | `{ email, password }` |
| POST | `/auth/signin` | Login user | `{ email, password }` |
| POST | `/auth/refresh` | Refresh access token | `{ refresh_token }` |
| POST | `/auth/logout` | Logout user | - (requires Bearer token) |

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

## 🔒 Security Features

- **Password Security**: Argon2 hashing algorithm
- **JWT Tokens**: Short-lived access tokens (15 min) + long-lived refresh tokens (7 days)
- **Token Storage**: Refresh tokens hashed in database
- **CORS Protection**: Configured for frontend origins
- **Input Validation**: DTOs with class-validator
- **Error Handling**: Proper exception filters

## 🎯 Key UI Components (Test-Ready)

The following components include `data-testid` attributes for testing:

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

## 🏗 Architecture Decisions & Trade-offs

### Backend Choices

**✅ NestJS over Express**
- **Pros**: Built-in dependency injection, decorators, modular architecture
- **Cons**: Learning curve, more boilerplate
- **Why**: Better for scalable, maintainable applications

**✅ Prisma over TypeORM**
- **Pros**: Type-safe database client, excellent DX, automatic migrations
- **Cons**: Less flexible for complex queries
- **Why**: Better developer experience and type safety

**✅ Argon2 over bcrypt**
- **Pros**: More secure, resistant to timing attacks
- **Cons**: Slightly slower
- **Why**: Better security is worth the minimal performance trade-off

### Frontend Choices

**✅ Redux Toolkit over Context API**
- **Pros**: Better DevTools, middleware support, predictable state updates
- **Cons**: More boilerplate for simple apps
- **Why**: Better for complex state management and debugging

**✅ ShadCN UI over Material-UI**
- **Pros**: Customizable, modern design, copy-paste components
- **Cons**: Less comprehensive component library
- **Why**: More flexibility and modern aesthetic

**✅ Axios over Fetch**
- **Pros**: Interceptors, automatic JSON parsing, better error handling
- **Cons**: Additional dependency
- **Why**: Interceptors make token refresh seamless

### Security Trade-offs

**✅ localStorage for tokens**
- **Alternative**: httpOnly cookies
- **Trade-off**: Vulnerable to XSS but easier to implement
- **Mitigation**: Short-lived access tokens, secure refresh flow

**✅ 15-minute access token expiry**
- **Trade-off**: Balance between security and user experience
- **Why**: Frequent refresh without user disruption

## 🚀 Deployment

### Backend Deployment (Vercel/Railway)

1. **Connect to Supabase Database**
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
   ```

2. **Environment Variables**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `NODE_ENV=production`

3. **Deploy Commands**
   ```bash
   npm run build
   npm run start:prod
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Update API base URL**
   ```typescript
   const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-backend.vercel.app'
     : 'http://localhost:3000';
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   ```

## 🧪 Testing

### Backend Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Testing
```bash
# Component tests
npm run test

# E2E tests with test-ids
npm run test:e2e
```

## 📸 Screenshots

### Login Page
![Login Screenshot](./screenshots/login.png)

### Dashboard
![Dashboard Screenshot](./screenshots/dashboard.png)

### Mobile Responsive
![Mobile Screenshot](./screenshots/mobile.png)

## 🔄 Token Refresh Flow

```mermaid
sequenceDiagram
    participant Client
    participant Backend
    participant Database
    
    Client->>Backend: POST /auth/signin
    Backend->>Database: Verify user credentials
    Backend->>Client: { access_token, refresh_token }
    
    Note over Client: Store tokens
    
    Client->>Backend: GET /users/me (with access_token)
    Backend->>Client: User data
    
    Note over Client: Access token expires
    
    Client->>Backend: API request (401 response)
    Client->>Backend: POST /auth/refresh (with refresh_token)
    Backend->>Database: Verify refresh token
    Backend->>Client: { new_access_token, new_refresh_token }
    
    Client->>Backend: Retry original request
    Backend->>Client: Success response
```

## 📝 Available Scripts

### Backend
- `npm run start:dev` - Start development server with hot reload
- `npm run start:prod` - Start production server
- `npm run build` - Build for production
- `npm run test` - Run unit tests

### Frontend  
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Backend framework
- [Prisma](https://prisma.io/) - Database ORM
- [ShadCN UI](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/devsamurai](https://github.com/yourusername/devsamurai)

---

**Built with ❤️ for DevSamurai Interview**

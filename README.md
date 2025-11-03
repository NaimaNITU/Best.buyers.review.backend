pickhub-amazon/controllers/authController.js (login & getMe)
pickhub-amazon/middleware/auth.js (authenticateAdmin)
pickhub-amazon/routes/api.js (route /api/auth/login)

<!-- 🔐 PART 1: AUTHENTICATION (Proving Who You Are) -->
Authentication = Proving your identity
Like showing your ID card at hotel reception to prove you are who you say you are.
FRONTEND (You at reception):
"Hi, I'm naimaa2it@gmail.com and my password is admin123"
BACKEND (Hotel Reception):
"Let me check our records... ✅ Yes, you're registered!"
"Here's your room key (JWT Token) - use this to access your room"
What's a JWT Token?
A JWT Token is like a Hotel Room Key Card:
// Your JWT Token contains:
{
  "email": "naimaa2it@gmail.com",
  "role": "admin",
  "expires": "24 hours"
}
// Signed with: JWT_SECRET (hotel's master key)

<!-- PART 2: AUTHORIZATION (What You're Allowed to Do) -->
What is Authorization?
Authorization = Checking your permissions
Like the hotel checking if your room key can access:
Your room ✅
Swimming pool ✅
Other guests' rooms ❌

 <!-- PART 3: HOW FRONTEND & BACKEND CONNECT -->
 1. Login Process:
YOU (Frontend) → BACKEND
"Can I login? Email: naimaa2it@gmail.com, Password: admin123"
BACKEND → YOU (Frontend)
"✅ Success! Here's your token: eyJhbGciOiJIUzI1NiIs... (room key)"
FRONTEND stores token in localStorage (keeps room key in pocket)

2. Accessing Protected Areas:
YOU → BACKEND (want to see dashboard)
"GET /api/dashboard" + "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
BACKEND Security Guard:
- "Ah, you have a valid room key!"
- "Let me decode it... you're naimaa2it@gmail.com"
- "OK, here's your dashboard data: {...}"

3. Without Token:
YOU → BACKEND (no token)
"GET /api/dashboard"
BACKEND Security Guard:


FRONTEND (Client)          BACKEND (Server)           DATABASE
     |                         |                         |
     | 1. POST /login          |                         |
     | {email, password}       | → Checks credentials    | → Verify user
     |                         |                         |
     | ← Returns JWT Token     |                         |
     | (Room Key)              |                         |
     |                         |                         |
     | 2. GET /dashboard       |                         |
     | + Authorization Header  | → authenticateAdmin     |
     | + Bearer Token          | → Verifies JWT Token    |
     |                         | → If valid: proceed     |
     | ← Returns dashboard data| → If invalid: 401 error |
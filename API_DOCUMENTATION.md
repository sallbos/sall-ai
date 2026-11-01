# MR.SALL AI — API Documentation

This document describes the API endpoints provided by the MR.SALL AI Cloudflare Worker backend.

Base URL: `https://mrsall.ai/api` (Production) or `http://localhost:8787/api` (Local Wrangler dev)

---

## 1. Authentication Endpoints

### POST `/api/auth/register`
Creates a new user account.
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "Jane Doe"
}
```
- **Response (201 Created)**:
```json
{
  "token": "token_session_jwt_hash...",
  "user": {
    "id": "usr_1730000000",
    "email": "user@example.com",
    "fullName": "Jane Doe",
    "role": "user",
    "tier": "free"
  }
}
```

### POST `/api/auth/login`
Authenticates an existing user.
- **Request Body**:
```json
{
  "email": "alex@mrsall.ai",
  "password": "Password123!"
}
```
- **Response (200 OK)**:
```json
{
  "token": "token_session_jwt_hash...",
  "user": {
    "id": "usr_demo_user_002",
    "email": "alex@mrsall.ai",
    "fullName": "Alex Vance",
    "role": "user",
    "tier": "free"
  }
}
```

### GET `/api/auth/me`
Retrieves current authenticated session profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "user": {
    "id": "usr_demo_user_002",
    "email": "alex@mrsall.ai",
    "fullName": "Alex Vance",
    "role": "user",
    "tier": "free"
  }
}
```

---

## 2. AI Intelligence Endpoints

### POST `/api/chat`
Streams or generates a conversational completion.
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (Optional)
- **Request Body**:
```json
{
  "messages": [
    { "sender": "user", "content": "Explain quantum computing in simple terms." }
  ],
  "options": {
    "model": "gemini-1.5-flash",
    "temperature": 0.7
  }
}
```
- **Response**: Streamed `text/plain; charset=utf-8` chunks or JSON response.

### POST `/api/write`
Executes one of the 9 specialized AI Writing Studio engines.
- **Request Body**:
```json
{
  "tool": "article",
  "params": {
    "topic": "Future of Autonomous Cloud Infrastructure",
    "tone": "Professional & Analytical",
    "length": "Standard (~800 words)",
    "keywords": "Cloudflare, Workers, D1"
  }
}
```

### POST `/api/translate`
Performs trilingual neural translation between English, Arabic, and French.
- **Request Body**:
```json
{
  "text": "Intelligence Without Limits",
  "sourceLang": "en",
  "targetLang": "ar"
}
```
- **Response**:
```
ذكاء بلا حدود
```

---

## 3. Usage & Quotas

### GET `/api/usage`
Returns daily consumed quota and limits for the user tier.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "usage": {
    "date": "2026-11-01",
    "messages": 8,
    "images": 3,
    "devOps": 12
  },
  "tier": "free"
}
```

---

## 4. Admin Telemetry

### GET `/api/admin/stats`
Protected endpoint returning system-wide performance and user metrics.
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response (200 OK)**:
```json
{
  "totalUsers": 1429,
  "activePro": 384,
  "aiRequestsToday": 28510,
  "systemUptime": "99.99%",
  "edgeRegion": "Global Anycast (275+ cities)",
  "databaseStatus": "Healthy"
}
```

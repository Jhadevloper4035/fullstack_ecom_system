# API Documentation

Base URL: `http://localhost:4000/api` (development)

## Authentication Endpoints

### Register User

Creates a new user account and sends verification email.

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

### Login

Authenticates user and returns JWT tokens.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "isVerified": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Note:** Refresh token is set as httpOnly cookie automatically.

---

### Verify Email

Verifies user email address using token from email.

```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "isVerified": true
  }
}
```

---

### Request Password Reset

Sends password reset email to user.

```http
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent."
}
```

**Note:** Always returns success to prevent email enumeration.

---

### Reset Password

Resets user password using token from email.

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### Refresh Access Token

Rotates refresh token and returns new access token.

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh-token-value"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Note:** New refresh token is set as httpOnly cookie.

---

### Get Current User

Returns currently authenticated user information.

```http
GET /api/auth/me
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "isVerified": true
  }
}
```

---

### Logout

Logs out user from current device.

```http
POST /api/auth/logout
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Logout All Devices

Logs out user from all devices by revoking all refresh tokens.

```http
POST /api/auth/logout-all
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out from all devices"
}
```

---

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

### Authorization Error (403 Forbidden)
```json
{
  "success": false,
  "error": "Email verification required"
}
```

### Rate Limit Error (429 Too Many Requests)
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later"
}
```

### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/register` | 5 requests | 15 minutes |
| `/api/auth/login` | 5 requests | 15 minutes |
| `/api/auth/request-password-reset` | 3 requests | 1 hour |
| `/api/auth/verify-email` | 3 requests | 1 hour |
| Other `/api/auth/*` | 5 requests | 15 minutes |
| All other `/api/*` | 100 requests | 15 minutes |

---

## Token Expiration

| Token Type | Expiration |
|------------|------------|
| Access Token | 15 minutes |
| Refresh Token | 7 days |
| Verification Token | 24 hours |
| Password Reset Token | 1 hour |

---

## Security Features

### Token Rotation
- Every refresh generates a new access + refresh token pair
- Old refresh token is invalidated immediately
- Prevents token reuse attacks

### Token Blacklisting
- Logged out tokens are blacklisted in Redis
- Blacklist entries expire automatically
- Prevents use of stolen tokens

### Token Family Detection
- Tracks token lineage for rotation
- If reuse detected, entire family is revoked
- Protects against token theft

### Password Security
- Hashed with bcrypt (12 rounds)
- Enforces strong password requirements
- Salt generated per password

### Rate Limiting
- Prevents brute force attacks
- Different limits for sensitive endpoints
- IP-based limiting

---

## HTTP Headers

### Request Headers
```http
Content-Type: application/json
Authorization: Bearer <access-token>  (for protected routes)
```

### Response Headers
```http
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## CORS Configuration

**Allowed Origins:**
- `http://localhost:3000` (development)
- Your production domain

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:**
- Content-Type, Authorization

**Credentials:**
- Enabled (for cookie-based refresh tokens)

---

## WebSocket Support

Currently not implemented. Future enhancement for real-time notifications.

---

## Pagination

Not applicable for authentication endpoints. Future endpoints may support:

```http
GET /api/resource?page=1&limit=20
```

---

## Example Workflows

### Complete Registration Flow

1. **Register**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!"
  }'
```

2. **Check Email** (get verification token)

3. **Verify Email**
```bash
curl -X POST http://localhost:4000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "verification-token"}'
```

4. **Login**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Password Reset Flow

1. **Request Reset**
```bash
curl -X POST http://localhost:4000/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

2. **Check Email** (get reset token)

3. **Reset Password**
```bash
curl -X POST http://localhost:4000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token",
    "password": "NewSecurePass123!",
    "confirmPassword": "NewSecurePass123!"
  }'
```

### Token Refresh Flow

```bash
# Automatic refresh happens in frontend
# Or manually:
curl -X POST http://localhost:4000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -H "Cookie: refreshToken=your-refresh-token" \
  -d '{"refreshToken": "your-refresh-token"}'
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (authentication failed) |
| 403 | Forbidden (authorization failed) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Testing with Postman

Import this collection structure:

```json
{
  "info": {
    "name": "Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4000/api"
    },
    {
      "key": "accessToken",
      "value": ""
    }
  ]
}
```

Set up automatic token refresh in Postman pre-request scripts.

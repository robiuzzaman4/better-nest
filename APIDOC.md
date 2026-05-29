# API Documentation

This document outlines all Authentication and User-related API endpoints for the Better Auth NestJS application. 

**Base URL:** `http://localhost:5000`
**Global Prefix:** `/api/v1`

---

## 1. Public / Utility Endpoints

### Health Check
Checks if the API server is up and running.
- **Endpoint**: `GET /api/v1/health`
- **Requires Auth**: No
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-05-30T00:00:00.000Z"
  }
  ```

---

## 2. Authentication Endpoints (Better Auth)
These routes are automatically provided by the `@thallesp/nestjs-better-auth` integration and are mounted at `/api/v1/auth`.

### Sign Up (Phone Number)
Creates a new user account using a phone number and password.
- **Endpoint**: `POST /api/v1/auth/sign-up/phone-number`
- **Requires Auth**: No
- **Request Body**:
  ```json
  {
    "phoneNumber": "+8801712345678",
    "password": "strongPassword123",
    "name": "John Doe"
  }
  ```

### Sign In (Phone Number)
Authenticates an existing user and returns an HTTP-only secure session cookie.
- **Endpoint**: `POST /api/v1/auth/sign-in/phone-number`
- **Requires Auth**: No
- **Request Body**:
  ```json
  {
    "phoneNumber": "+8801712345678",
    "password": "strongPassword123"
  }
  ```

### Check Session
Validates the current session cookie and returns the active user's details.
- **Endpoint**: `GET /api/v1/auth/session`
- **Requires Auth**: Yes (via HTTP-Only Cookie or Bearer Token)
- **Response**:
  ```json
  {
    "session": {
      "id": "session-id",
      "expiresAt": "2026-06-06T00:00:00.000Z",
      "ipAddress": "127.0.0.1"
    },
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "phoneNumber": "+8801712345678"
    }
  }
  ```

### Sign Out
Destroys the current session and clears the authentication cookie.
- **Endpoint**: `POST /api/v1/auth/sign-out`
- **Requires Auth**: Yes
- **Request Body**: *(Empty)*
  ```json
  {}
  ```

### Forget Password
Triggers a password reset request. Note: by default this expects an email.
- **Endpoint**: `POST /api/v1/auth/forget-password`
- **Requires Auth**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "redirectTo": "http://localhost:3000/reset-password"
  }
  ```

### Reset Password
Sets a new password using a valid reset token.
- **Endpoint**: `POST /api/v1/auth/reset-password`
- **Requires Auth**: No
- **Request Body**:
  ```json
  {
    "newPassword": "newStrongPassword123",
    "token": "token-from-link-or-sms"
  }
  ```

---

## 3. User Endpoints

### Get Current User Profile
Fetches the currently authenticated user's basic profile details.
- **Endpoint**: `GET /api/v1/users/me`
- **Requires Auth**: Yes (via Session Cookie)
- **Response**:
  ```json
  {
    "id": "user-id-string",
    "name": "John Doe",
    "email": "1712345678@phone.yourapp.com"
  }
  ```

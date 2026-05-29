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
- **cURL Command**:
  ```bash
  curl -X GET http://localhost:5000/api/v1/health
  ```

---

## 2. Authentication Endpoints (Better Auth)
These routes are automatically provided by the `@thallesp/nestjs-better-auth` integration and are mounted at `/api/v1/auth`.

### 1. Request OTP (Sign Up / Sign In)
Sends a 6-digit OTP to the user's phone number. This is the first step for both signing up and signing in.
- **Endpoint**: `POST /api/v1/auth/phone-number/send-otp`
- **Requires Auth**: No
- **Request Body**:
  ```json
  {
    "phoneNumber": "+8801712345678"
  }
  ```
- **cURL Command**:
  ```bash
  curl -X POST http://localhost:5000/api/v1/auth/phone-number/send-otp -H "Content-Type: application/json" -d "{\"phoneNumber\":\"+8801712345678\"}"
  ```
  *(Note: For local development, check your NestJS server console for the generated OTP)*

### 2. Verify OTP (Authenticates or Creates Account)
Verifies the OTP. If the user doesn't exist, an account is automatically created. Returns an HTTP-only secure session cookie.
- **Endpoint**: `POST /api/v1/auth/phone-number/verify`
- **Requires Auth**: No
- **Request Body**:
  ```json
  {
    "phoneNumber": "+8801712345678",
    "code": "123456"
  }
  ```
- **cURL Command**:
  ```bash
  curl -X POST http://localhost:5000/api/v1/auth/phone-number/verify -H "Content-Type: application/json" -d "{\"phoneNumber\":\"+8801712345678\",\"code\":\"123456\"}" -c cookies.txt
  ```
  *(Saves the session cookie to `cookies.txt` for future requests)*

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
- **cURL Command**:
  ```bash
  curl -X GET http://localhost:5000/api/v1/auth/session -b cookies.txt
  ```

### Sign Out
Destroys the current session and clears the authentication cookie.
- **Endpoint**: `POST /api/v1/auth/sign-out`
- **Requires Auth**: Yes
- **Request Body**: *(Empty)*
  ```json
  {}
  ```
- **cURL Command**:
  ```bash
  curl -X POST http://localhost:5000/api/v1/auth/sign-out -b cookies.txt -c cookies.txt
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
- **cURL Command**:
  ```bash
  curl -X POST http://localhost:5000/api/v1/auth/forget-password -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"redirectTo\":\"http://localhost:3000/reset-password\"}"
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
- **cURL Command**:
  ```bash
  curl -X POST http://localhost:5000/api/v1/auth/reset-password -H "Content-Type: application/json" -d "{\"newPassword\":\"newStrongPassword123\",\"token\":\"token-from-link-or-sms\"}"
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
- **cURL Command**:
  ```bash
  curl -X GET http://localhost:5000/api/v1/users/me -b cookies.txt
  ```

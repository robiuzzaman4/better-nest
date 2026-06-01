# API Documentation

This document outlines the public API endpoints for the Better Auth NestJS application.

**Base URL:** `http://localhost:5000`
**Global Prefix:** `/api/v1`

---

## Standard Response Shape

All application endpoints return the same response envelope:

```ts
type APIResponse<T> = {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
};
```

### Success Example

```json
{
  "success": true,
  "status": 200,
  "message": "Request successful",
  "data": {}
}
```

### Error Example

```json
{
  "success": false,
  "status": 400,
  "message": "phoneNumber is required",
  "data": null
}
```

---

## 1. Public / Utility Endpoints

### Health Check

Checks if the API server is up and running.

- **Endpoint**: `GET /api/v1/health`
- **Requires Auth**: No
- **Response**:
  ```json
  {
    "success": true,
    "status": 200,
    "message": "Request successful",
    "data": {
      "status": "ok",
      "timestamp": "2026-05-30T00:00:00.000Z"
    }
  }
  ```
- **cURL Command**:
  ```bash
  curl -X GET http://localhost:5000/api/v1/health
  ```

---

## 2. Authentication Endpoints

These routes are app-owned facade endpoints mounted at `/api/v1/auth`. The frontend does not need to use `better-auth/client`; the NestJS server calls Better Auth internally.

> Note: Better Auth's generated public controllers are disabled. Only the custom facade routes documented here are publicly available under `/api/v1/auth`.

### 1. Send Phone Number OTP

Sends a 6-digit OTP to the user's phone number.

- **Endpoint**: `POST /api/v1/auth/phone-number/send-otp`
- **Requires Auth**: No
- **Request Body**:
  ```json
  {
    "phoneNumber": "+8801712345678"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "status": 201,
    "message": "Phone verification code sent",
    "data": {
      "message": "code sent"
    }
  }
  ```
- **cURL Command**:
  ```bash
  curl -X POST http://localhost:5000/api/v1/auth/phone-number/send-otp -H "Content-Type: application/json" -d "{\"phoneNumber\":\"+8801712345678\"}"
  ```
  _(Note: For local development, check your NestJS server console for the generated OTP)_

### 2. Verify Phone Number OTP

Verifies the OTP. If the user does not exist, Better Auth creates the account. This endpoint does **not** create a session; it verifies or creates the user with `disableSession: true`.

- **Endpoint**: `POST /api/v1/auth/phone-number/verify`
- **Requires Auth**: No
- **Request Body**:
  ```json
  {
    "phoneNumber": "+8801712345678",
    "code": "123456",
    "name": "John Doe"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "status": 201,
    "message": "Phone number verified",
    "data": {
      "status": true,
      "token": null,
      "user": {
        "id": "user-id",
        "name": "John Doe",
        "email": "8801712345678@phone.rusign.com",
        "emailVerified": false,
        "phoneNumber": "+8801712345678",
        "phoneNumberVerified": true,
        "createdAt": "2026-05-30T00:00:00.000Z",
        "updatedAt": "2026-05-30T00:00:00.000Z"
      }
    }
  }
  ```
- **cURL Command**:
  ```bash
  curl -X POST http://localhost:5000/api/v1/auth/phone-number/verify -H "Content-Type: application/json" -d "{\"phoneNumber\":\"+8801712345678\",\"code\":\"123456\",\"name\":\"John Doe\"}"
  ```

### Planned Auth Facade Routes

These route names are reserved for future custom facade implementations and are not currently documented as active endpoints:

- `POST /api/v1/auth/sign-in/phone-number`
- `POST /api/v1/auth/phone-number/request-password-reset`
- `POST /api/v1/auth/phone-number/reset-password`

---

## 3. User Endpoints

### Get Current User Profile

Fetches the currently authenticated user's basic profile details.

- **Endpoint**: `GET /api/v1/users/me`
- **Requires Auth**: Yes (via Session Cookie)
- **Response**:
  ```json
  {
    "success": true,
    "status": 200,
    "message": "Request successful",
    "data": {
      "id": "user-id-string",
      "name": "John Doe",
      "email": "8801712345678@phone.rusign.com"
    }
  }
  ```
- **cURL Command**:
  ```bash
  curl -X GET http://localhost:5000/api/v1/users/me -b cookies.txt
  ```

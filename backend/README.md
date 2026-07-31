# Love2Bazzar Backend

Production Node.js, Express.js, MongoDB, and Mongoose API for the approved Love2Bazzar frontend.

## Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT access tokens + refresh tokens
- bcrypt password hashing
- express-validator
- Helmet, CORS, rate limiting, mongo sanitize, XSS protection
- Multer + Cloudinary
- Morgan logging
- Swagger docs
- Docker and docker-compose

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API health check:

```bash
GET http://localhost:5000/health
```

Swagger:

```bash
http://localhost:5000/api-docs
```

API base path:

```bash
http://localhost:5000/api/v1
```

## Docker

```bash
cd backend
docker compose up --build
```

## Auth Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `PATCH /api/v1/auth/me`

Refresh tokens are stored as hashes in MongoDB and sent to clients as HTTP-only cookies.

## Seed Admin

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, then run:

```bash
npm run seed
```

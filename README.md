# MERN-stack-site

MERN app for testing a REST API and JWT auth (access + refresh tokens in httpOnly cookies).

## Setup

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run install:all
npm run dev
```

- Server: http://localhost:5000
- Client: http://localhost:5173

Requires Node 20+ and MongoDB. Env variables are listed in each `.env.example`.

## API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/register` | No | `name`, `email`, `password` | Create account |
| POST | `/auth/login` | No | `email`, `password`, `rememberMe`? | Log in, sets access + refresh cookies |
| POST | `/auth/refresh` | Refresh cookie | none | Issue a new access token |
| POST | `/auth/logout` | Yes | none | Clear both cookies |
| GET | `/auth/me` | Yes | none | Current user |

`?` marks an optional field.

## Authentication

- Access token: 15 min, sent automatically as a cookie.
- Refresh token: session cookie, or 30 days if `rememberMe` is true.
- On a `401`, the client calls `/auth/refresh` and retries the request once.

Errors return `{ "message": "..." }` with status `4xx`.
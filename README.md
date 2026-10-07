# MERN-stack-site

MERN app for testing a REST API and JWT auth (access + refresh tokens in httpOnly cookies).

## Setup

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run install:all
npx prisma generate
npm run dev
```

- Server: http://localhost:5000
- Client: http://localhost:5173

Requires Node 20+ and MongoDB. Env variables are listed in each `.env.example`.

## API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Request | Response | Description |
|--------|----------|------|---------|----------|-------------|
| POST | `/auth/register` | No | `email`, `password`, `firstName`, `lastName?` | `message`, `user?` | Create account |
| POST | `/auth/login` | No | `email`, `password`, `rememberMe?` | `message`, `user?`, JWT cookies | Log in, sets access + refresh http only cookies |
| POST | `/auth/refresh` | No | JWT cookies | `message`, JWT cookies | Issue a new access token |
| POST | `/auth/logout` | No | none | `204` status | Clear both cookies |
| GET | `/auth/me` | Yes | none | `user` | Current user |

`?` marks an optional field.

## Authentication

- user object has the properties: `{ id, email, firstName, lastName}`.
- Access token: 15 min, sent automatically as a cookie named `access_token`.
- Refresh token: session cookie, or 30 days if `rememberMe` is true, named `refresh_token`.
- On a `401`, the client calls `/auth/refresh` and retries the request once.
- Errors return `{ "message": "..." }` with status `4xx`/`5xx`.
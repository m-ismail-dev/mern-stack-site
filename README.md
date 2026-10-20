# MERN-stack-site

MERN app for testing a REST API and JWT auth (access + refresh tokens in httpOnly cookies).

## Setup

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run install:all
npx prisma generate --prefix server
npm run dev
```

Requires Node 20+. Env variables are listed in each `.env.example`, except `DATABASE_URL` variable, it is required and has no default.

## API

Base URL: `http://localhost:3000/api`

| Method | Endpoint         | Auth | Request                                       | Response                        | Description                                     |
| ------ | ---------------- | ---- | --------------------------------------------- | ------------------------------- | ----------------------------------------------- |
| POST   | `/auth/register` | No   | `email`, `password`, `firstName`, `lastName?`, `role?`, `phone?` | `message`, `user?`              | Create account                                  |
| POST   | `/auth/login`    | No   | `email`, `password`, `rememberMe?`            | `message`, `user?`, JWT cookies | Log in, sets access + refresh http only cookies |
| POST   | `/auth/refresh`  | No   | JWT cookies                                   | `message`, JWT cookies          | Issue a new access token                        |
| POST   | `/auth/logout`   | No   | none                                          | `204` status                    | Clear both cookies                              |
| GET    | `/auth/me`       | Yes  | none                                          | `user`                          | Current user                                    |

`?` marks an optional field.

## Authentication

- user object in response has the properties: `{ id, email, firstName, lastName, role, phone}`.
- Access token: session cookie, defaults to expire in 15 minuts, sent automatically as a cookie named `access_token`.
- Refresh token: defaults to expire in 7 days, or 30 days if `rememberMe` is true, named `refresh_token`, refresh cookie `maxAge` can't be set with environment variables so the maximum is 7 or 30 days.
- On a `401`, the client calls `/auth/refresh` and retries the request once.
- Errors return `{ "message": "..." }` with status `4xx`/`5xx`.
- Role defaults to `CUSTOMER`.

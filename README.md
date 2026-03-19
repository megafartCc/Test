# Secure Auth Starter

This project now includes:

- A React + Tailwind frontend focused on registration and login.
- An Express backend with secure authentication helpers.
- MySQL integration configured with environment variables.
- Automatic table creation for the `users` table at server startup.

## Environment variables

Copy `.env.example` to `.env` and provide your values:

- `MYSQL_DATABASE`
- `MYSQL_HOST`
- `MYSQL_PASSWORD`
- `MYSQL_PORT`
- `MYSQL_URL` (optional alternative to individual MySQL settings)
- `MYSQL_USER`
- `JWT_SECRET`
- `CLIENT_ORIGIN`

## Database

The SQL schema is in `server/schema.sql`. Create or select the database named by `MYSQL_DATABASE`, then run that file.

The server also calls `ensureDatabase()` on startup to create the `users` table if it does not already exist.

## Security notes

- Passwords are hashed with `bcryptjs`.
- Authentication uses signed JWTs stored in HTTP-only cookies.
- SQL access uses prepared statements via `mysql2`.
- Authentication routes are rate-limited.
- `helmet` adds common HTTP security headers.

## Development

```bash
npm install
npm run dev:server
npm run dev
```

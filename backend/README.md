# @fsc/api

## Configure Postgres
Create a `.env` file based on `.env.example`:

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: API port (default 4000)
- `WEB_ORIGIN`: Vite dev origin for CORS (default `http://localhost:5173`)

## Run migrations
From repo root:

```bash
npm install
npm run prisma:generate -w @fsc/api
npm run prisma:migrate -w @fsc/api
```

## Start API

```bash
npm run dev -w @fsc/api
```

Health check: `GET /health`


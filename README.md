## Inkubator IT — Hono + Bun API Template

Standardized API template for projects in the Inkubator IT GitHub organization. This template is built and maintained by the DevOps team to unify stack choices, local development, containerization, and deployment conventions across client projects.

### Tech stack
- **Runtime**: Bun
- **Framework**: Hono
- **Language**: TypeScript
- **Quality**: Biome (lint & format)
- **Containerization**: Docker
- **Database (local)**: PostgreSQL via Docker Compose

### Project structure
```
.
├─ src/
│  ├─ configs/           # Configuration helpers
│  ├─ controllers/       # Request handlers
│  ├─ db/                # Database client/queries
│  ├─ lib/               # Shared libraries
│  ├─ middlewares/       # Hono middlewares
│  ├─ repositories/      # Data access layer
│  ├─ routes/            # Route registrations
│  ├─ services/          # Business logic
│  ├─ types/             # Type definitions
│  ├─ utils/             # Utilities
│  └─ index.ts           # App entry
├─ Dockerfile            # App container image
├─ docker-compose.yaml   # Local Postgres service
├─ .env.example          # Example environment variables
├─ biome.json            # Biome config (lint/format)
├─ tsconfig.json         # TypeScript config
└─ package.json          # Scripts and deps
```

### Prerequisites
- **Bun** installed locally (`bun --version`)
- **Docker** and **Docker Compose**

### Getting started (local development)
1) Create a new repository using this template in the Inkubator IT organization.
2) Clone your new repository.
3) Create a local env file based on the example and adjust values:
```sh
cp .env.example .env
```
4) Install dependencies:
```sh
bun install
```
5) Start the local database (optional if you need Postgres):
```sh
docker compose up -d db
```
6) Start the API in dev mode (hot reload):
```sh
bun run dev
```
7) Open `http://localhost:3000` (or your `APP_PORT`).

### Environment variables
Duplicate `.env.example` to `.env` and update values. Do not commit `.env`.

- **APP_PORT**: Application port (default `3000`). The Dockerfile exposes this.
- **NODE_ENV**: `development` | `production`.
- **DB_HOST**, **DB_PORT**, **POSTGRES_USER**, **POSTGRES_PASSWORD**, **POSTGRES_DB**: Local Postgres settings.
- **DATABASE_URL**: Full Postgres URL (used by ORMs/clients).

### Database (local)
Start Postgres:
```sh
docker compose up -d db
```
The default credentials are defined in `.env.example`. Connect, for example:
```sh
psql "postgresql://myuser:mypassword@localhost:5432/mydb"
```

### Run with Docker
Build the image:
```sh
docker build -t inkubatorit/hono-template .
```
Run the container (reads `.env`):
```sh
docker run --rm --env-file .env -p ${APP_PORT:-3000}:${APP_PORT:-3000} inkubatorit/hono-template
```

### NPM/Bun scripts
- **dev**: `bun run --hot src/index.ts`
- **start**: `bun run src/index.ts`
- **lint**: `biome lint .`
- **lint:fix**: `biome lint --write .`
- **format**: `biome format --write .`

### Code quality
This template uses Biome for linting and formatting. Run locally before commits:
```sh
bun run lint
bun run format
```

### Deployment notes
- The app is containerized. Provide environment variables via your platform or an env file.
- Ensure `APP_PORT` is set to the externally exposed port when running behind a reverse proxy.
- Set `NODE_ENV=production` in production environments.

### Contributing
This template is maintained by the **Inkubator IT DevOps** team. Contributions and improvements are welcome via Pull Requests. For significant changes, please open an Issue for discussion first.

### Support
For questions or support, contact the Inkubator IT DevOps team.

### License
Copyright (c) Inkubator IT. All rights reserved.

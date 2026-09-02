# Kanban

A simple Kanban board application for creating boards, columns, and cards.

## Live Demo

[Live Demo →](https://kanban-so.netlify.app/)

## Tech Stack

- TypeScript
- Hono
- Drizzle ORM
- PostgreSQL
- React
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod
- pnpm Workspaces
- Turborepo

## How to Run

Requirements:

- Node.js 24+
- pnpm 11+
- PostgreSQL

Install dependencies:

```bash
pnpm install
```

Create environment files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Set port and your database connection in `apps/api/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
PORT=3000
```

Set API URL in `apps/web/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Build shared contracts:

```bash
pnpm --filter @kanban/contracts build
```

Start the development servers:

```bash
pnpm dev
```

The frontend runs on `http://localhost:5173` and the API runs on `http://localhost:3000`.

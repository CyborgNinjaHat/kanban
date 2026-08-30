import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', cors());

app.use(logger());

app.get('/health', (context) => {
  return context.json({ status: 'ok' }, 200);
});

showRoutes(app, {
  verbose: false,
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

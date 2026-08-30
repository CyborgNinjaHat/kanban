import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { NotFoundError } from './common/error/app-error.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = new Hono();

app.use('*', cors());

app.use(logger());

app.get('/health', (context) => {
  return context.json({ status: 'ok' }, 200);
});

app.notFound(() => {
  throw new NotFoundError('Route not found');
});

app.onError(errorHandler);

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

import { Hono } from 'hono';
import { corsMiddleware } from './middleware/cors';
import { nonceService } from './services/nonce';
import routesHandler from './routes/index';

const app = new Hono();

// Enable CORS for all routes
app.use('/*', corsMiddleware);



// Start nonce cleanup interval
nonceService.startCleanupInterval();

// Mount route handlers
app.get('/', (c) => c.json({ message: 'Hello World' }));
app.route('/api', routesHandler);


// Error handlers
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export default {
  port: process.env.PORT || 8080,
  fetch: app.fetch
};

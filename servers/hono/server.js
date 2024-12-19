import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const app = new Hono();
const PORT = process.env.HONO_PORT || 4000;

app.get('/hello', c => {
  return c.json({ message: 'Hello World' });
});

console.log(`Hono server is running on http://localhost:${PORT}`);

serve({ fetch: app.fetch, port: PORT });

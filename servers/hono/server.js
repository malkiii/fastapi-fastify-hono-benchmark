import { MongoClient } from 'mongodb';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

// Create a new Hono instance
const app = new Hono();
const PORT = process.env.HONO_PORT || 4000;

// Create a new MongoDB client
const client = new MongoClient(process.env.MONGODB_URI);

// Return a simple JSON response
app.get('/', c => {
  return c.json({ name: 'hono', status: 'OK', timestamp: Date.now() });
});

// Return a list of items from the database
app.get('/items', async c => {
  const limit = parseInt(c.req.query('limit')) || 10;

  const db = client.db('benchmark-data');
  const itemsCollection = db.collection('Items');

  const items = await itemsCollection
    .find({})
    .project({ _id: 0 })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return c.json({
    total: items.length,
    items: items.map((item, index) => ({ id: index + 1, code: item.code })),
  });
});

await client.connect();

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Hono server is running on http://localhost:${PORT}`);
});

import Fastify from 'fastify';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

// Create a new Fastify instance
const fastify = Fastify({ logger: true });
const PORT = process.env.FASTIFY_PORT || 3000;

// Create a new MongoDB client
const client = new MongoClient(process.env.MONGODB_URI);

// Return a simple JSON response
fastify.get('/', async (request, reply) => {
  return { name: 'fastify', status: 'OK', timestamp: Date.now() };
});

// Return a list of items from the database
fastify.get('/items', async (request, reply) => {
  const limit = parseInt(request.query.limit) || 10;

  const db = client.db('benchmark-data');
  const itemsCollection = db.collection('Items');

  const items = await itemsCollection
    .find({})
    .project({ _id: 0 })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return {
    total: items.length,
    items: items.map((item, index) => ({ id: index + 1, code: item.code })),
  };
});

// Create a new user
fastify.post('/signup', async (request, reply) => {
  console.log('New User:', crypto.randomUUID());

  return reply.code(302).send();
});

const start = async () => {
  try {
    await client.connect();

    await fastify.listen({ host: '0.0.0.0', port: PORT }, () => {
      console.log(`Fastify server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();

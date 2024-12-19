import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const fastify = Fastify({ logger: true });
const PORT = process.env.FASTIFY_PORT || 3000;

fastify.get('/hello', async (request, reply) => {
  return { message: 'Hello World' };
});

const start = async () => {
  try {
    await fastify.listen({ host: '0.0.0.0', port: PORT });

    console.log(`Fastify server is running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

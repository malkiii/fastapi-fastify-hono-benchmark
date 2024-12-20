import { beforeAll, describe, expect, it } from 'vitest';
import { initializeMongodb } from './mongodb.js';

const servers = {
  fastapi: `http://localhost:${process.env.FASTAPI_PORT}`,
  fastify: `http://localhost:${process.env.FASTIFY_PORT}`,
  hono: `http://localhost:${process.env.HONO_PORT}`
} as const;

beforeAll(async () => {
  console.log('* Running tests on the following servers:');
  console.table(servers);

  await initializeMongodb();
});

describe('Check if the servers are running', () => {
  for (const [server, url] of Object.entries(servers)) {
    it(`should get a response from ${server}`, async () => {
      // Check if the server is running
      const response = await fetch(url);
      expect(response.status).toBe(200);

      // Returning the expected data
      const data = await response.json();
      expect(data.name).toBe(server);
      expect(data.status).toBe('OK');
    });
  }
});

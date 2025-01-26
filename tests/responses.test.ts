import { beforeAll, describe, expect, it } from 'vitest';
import { initializeMongodb } from './mongodb.js';

const servers = {
  fastapi: `http://localhost:${process.env.FASTAPI_PORT}`,
  fastify: `http://localhost:${process.env.FASTIFY_PORT}`,
  hono: `http://localhost:${process.env.HONO_PORT}`,
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
      const data = (await response.json()) as { name: string; status: string };
      expect(data.name).toBe(server);
      expect(data.status).toBe('OK');
    });
  }
});

type Item = { id: number; code: string };

describe('Fetching items from the database', () => {
  const limit = getRandomInt(1, 20);

  for (const [server, url] of Object.entries(servers)) {
    it(`should get ${limit} items from ${server}`, async () => {
      const response = await fetch(`${url}/items?limit=${limit}`);
      expect(response.status).toBe(200);

      const data = (await response.json()) as { total: number; items: Item[] };

      expect(data.total).toBe(limit);
      expect(data.items[0]?.id).toBe(1);
      expect(data.items[0]).toHaveProperty('code');
    });
  }
});

describe('Handling POST requests', () => {
  const form = new FormData();

  form.append('name', 'John Doe');
  form.append('email', 'test@example.com');
  form.append('password', '123456');

  for (const [server, url] of Object.entries(servers)) {
    it(`should add an item to ${server}`, async () => {
      const response = await fetch(`${url}/signup`, {
        method: 'POST',
        redirect: 'manual', // Prevent automatic redirection
        body: JSON.stringify(Object.fromEntries(form)),
      });

      // check if it's a redirect response
      expect(response.status).toBe(302);
    });
  }
});

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

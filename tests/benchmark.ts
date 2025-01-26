import fs from 'fs';
import path from 'path';
import autocannon from 'autocannon';
import ora from 'ora';

const servers = [
  {
    name: 'FastAPI',
    slug: 'fastapi',
    url: `http://localhost:${process.env.FASTAPI_PORT}`,
  },
  {
    name: 'Fastify',
    slug: 'fastify',
    url: `http://localhost:${process.env.FASTIFY_PORT}`,
  },
  {
    name: 'Hono.js',
    slug: 'hono',
    url: `http://localhost:${process.env.HONO_PORT}`,
  },
] as const;

const rootDir = path.resolve(import.meta.dirname, '..');
const benchmarksDir = path.resolve(rootDir, 'benchmarks');

const options: Omit<autocannon.Options, 'url'> = {
  connections: 250, // number of concurrent connections
  pipelining: 1, // number of pipelined requests
  duration: 10, // test duration in seconds
};

function waitFor(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

async function run() {
  // create the benchmarks directory if it doesn't exist
  if (!fs.existsSync(benchmarksDir)) {
    fs.mkdirSync(benchmarksDir);
  }

  const totalItems = 50;

  // generate the benchmarks for each server
  for (const server of servers) {
    const { name: title, slug, url } = server;
    let result: Record<string, autocannon.Result> = {};

    const spinner = ora(
      `Testing ${title} server with ${options.connections} connections...`,
    ).start();

    result['/'] = await autocannon({
      title,
      url,
      ...options,
      requests: [
        {
          method: 'GET',
          path: '/',
        },
      ],
    });

    await waitFor(5 * 1000);

    spinner.text = `Fetching ${totalItems} from ${title} server with ${options.connections} connections...`;

    result['/items'] = await autocannon({
      title,
      url,
      ...options,
      requests: [
        {
          method: 'GET',
          path: `/items?limit=${totalItems}`,
        },
      ],
    });

    await waitFor(5 * 1000);

    spinner.text = `Sending POST requests to ${title} server with ${options.connections} connections...`;

    const form = {
      name: 'John Doe',
      email: 'test@example.com',
      password: '123456',
    };

    result['/signup'] = await autocannon({
      title,
      url,
      ...options,
      requests: [
        {
          method: 'POST',
          path: '/signup',
          body: JSON.stringify(form),
        },
      ],
    });

    // write the results to a JSON file
    const outputFile = path.resolve(benchmarksDir, `${slug}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

    await waitFor(5 * 1000);

    spinner.succeed(`Results written to "./benchmarks/${slug}.json" file.\n`);
  }
}

run();

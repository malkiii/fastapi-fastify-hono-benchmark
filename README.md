# FastAPI vs Fastify vs Hono.js

This is a benchmark test of these "Fast" backend frameworks to see which one can handle the most requests per second using [AutoCannon](https://github.com/mcollina/autocannon).

## 📋 Requirements

- Node.js v22.12.0 or above.
- Python 3.13.0 or above and [Jupyter Notebook](https://jupyter.org/).
- [Docker](https://www.docker.com/) CLI.

## 💻 Local Setup

1. Install Node.js dev-dependencies using

   ```sh
   npm install
   ```

2. Install Python `matplotlib` and `numpy` dependencies using:

   ```sh
   pip install matplotlib numpy
   ```

## 📊 Benchmarking

1. Start `fastapi`, `fastify`, `hono`, and `mongodb` containers by opening a new terminal tab at the **root directory** and running:

   ```sh
   npm start
   ```

2. Check if everything is running correctly using:

   ```sh
   npm run test
   ```

3. Start benchmarking by running:

   ```sh
   npm run benchmark
   ```

> [!NOTE]
> After completing these steps, you can check the results in the [visualization.ipynb](./visualization.ipynb) file. Your results may be completely different from mine.

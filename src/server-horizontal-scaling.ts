import 'dotenv/config';
import os from 'node:os';
import url from 'node:url';
import http from 'node:http';
import cluster from 'node:cluster';
import { UsersDatabase } from './users.database.js';
import { UsersController } from './users.controller.js';
import { usersRouterFabric } from './router/users.router.js';

const usersDatabase = new UsersDatabase();
const usersController = new UsersController(usersDatabase);
const usersRouter = usersRouterFabric(usersController);

if (cluster.isPrimary) {
  const primaryServerPort = Number(process.env.PORT);
  const workersCount = os.availableParallelism() - 1;

  for (let i = 1; i <= workersCount; i++) {
    cluster.fork({ workerPort: primaryServerPort + i });
  }

  let workerIndexToProcessRequest = 1;
  const server = http.createServer((req, res) => {
    const hostUrl = new url.URL(`http://${req.headers.host}${req.url}`);
    const workerPort = Number(process.env.PORT) + workerIndexToProcessRequest;
    const urlToRedirect = `http://${hostUrl.hostname}:${workerPort}${hostUrl.pathname}`;

    res.writeHead(307, {
      location: urlToRedirect,
    }).end();

    if (workerIndexToProcessRequest === workersCount) {
      workerIndexToProcessRequest = 1;
    } else {
      workerIndexToProcessRequest++;
    }
  });

  server.listen(primaryServerPort);
} else {
  const server = http.createServer(async (req, res) => {
    try {
      const isHandled = await usersRouter(req, res);

      if (!isHandled) {
        res.writeHead(404).end(JSON.stringify({ message: 'Not existing endpoint' }));
      }
    } catch (err) {
      res.writeHead(500).end(JSON.stringify({ message: 'Something went wrong' }));
    }
  });

  server.listen(Number(process.env.workerPort));
}

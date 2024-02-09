import 'dotenv/config';
import * as http from 'node:http';
import { UsersDatabase } from './users.database.js';
import { UsersController } from './users.controller.js';
import { usersRouterFabric } from './router/users.router.js';

const usersDatabase = new UsersDatabase();
const usersController = new UsersController(usersDatabase);

const usersRouter = usersRouterFabric(usersController);

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

server.listen(Number(process.env.PORT));

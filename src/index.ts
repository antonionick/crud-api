import * as http from 'node:http';
import { UsersDatabase } from './users.database.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { usersRouterFabric } from './users.router.js';

const usersDatabase = new UsersDatabase();
const usersService = new UsersService(usersDatabase);
const usersController = new UsersController(usersService);

const usersRouter = usersRouterFabric(usersController);

const server = http.createServer(async (req, res) => {
  try {
    const isHandled = await usersRouter(req, res);

    if (!isHandled) {
      res.writeHead(404, 'Not existing endpoint');
      res.end();
    }
  } catch(err) {
    res.writeHead(500, 'Something went wrong');
  }
});

server.listen(8000);

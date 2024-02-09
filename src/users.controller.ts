import { IncomingMessage, ServerResponse } from 'node:http';
import * as uuid from 'uuid';
import { UsersService } from './users.service.js';
import { GET_USER_BY_ID_ENDPOINT } from './router/users-router.models.js';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  public async handleAllUsersRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const users = await this.usersService.getAllUsers();

    res
      .writeHead(200, {
        'Content-Type': 'application/json',
      })
      .end(JSON.stringify(users));
  }

  public async handleUserByIdRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const [, userId] = req.url!.match(GET_USER_BY_ID_ENDPOINT)!;

    if (!uuid.validate(userId)) {
      res
        .writeHead(400)
        .end(JSON.stringify({ message: 'invalid user id' }));
      return;
    }

    const user = await this.usersService.getUserById(userId);

    if (!user) {
      res
        .writeHead(404)
        .end(JSON.stringify({ message: 'user does not exist' }));
      return;
    }

    res
      .writeHead(200, {
        'Content-Type': 'application/json',
      })
      .end(JSON.stringify(user));
  }
}

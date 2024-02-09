import { IncomingMessage, ServerResponse } from 'node:http';
import * as uuid from 'uuid';
import { UsersService } from './users.service.js';
import { API_USERS_ID_REGEX } from './router/users-router.models.js';

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
    const [, userId] = req.url!.match(API_USERS_ID_REGEX)!;

    if (!uuid.validate(userId)) {
      res.writeHead(400).end(JSON.stringify({ message: 'invalid user id' }));
      return;
    }

    const user = await this.usersService.getUserById(userId);

    if (!user) {
      res.writeHead(404).end(JSON.stringify({ message: 'user does not exist' }));
      return;
    }

    res
      .writeHead(200, {
        'Content-Type': 'application/json',
      })
      .end(JSON.stringify(user));
  }

  public async handleCreateUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    return new Promise((resolve, reject) => {
      req.on('data', async (rawData) => {
        try {
          const stringifiedData = rawData.toString();
          const data = JSON.parse(stringifiedData);

          if (data.userName == null || data.age == null || !Array.isArray(data.hobbies)) {
            res.writeHead(400).end(JSON.stringify({ message: 'required fields are omitted' }));
            resolve();
            return;
          }

          const createdUser = await this.usersService.createUser(
            data.userName,
            data.age,
            data.hobbies,
          );

          res.writeHead(201).end(JSON.stringify(createdUser));
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

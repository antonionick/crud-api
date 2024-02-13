import { IncomingMessage, ServerResponse } from 'node:http';
import * as uuid from 'uuid';
import { API_USERS_ID_REGEX } from './router/users-router.models.js';
import { UsersDatabase } from './users.database.js';

export class UsersController {
  constructor(private readonly usersDatabase: UsersDatabase) {}

  public async getAllUsers(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const users = this.usersDatabase.getAllUsers();

    res
      .writeHead(200, {
        'Content-Type': 'application/json',
      })
      .end(JSON.stringify(users));
  }

  public async getUserById(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const [, userId] = req.url!.match(API_USERS_ID_REGEX)!;

    if (!uuid.validate(userId)) {
      res.writeHead(400).end(JSON.stringify({ message: 'invalid user id' }));
      return;
    }

    const user = this.usersDatabase.getUserById(userId);

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

  public createUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
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

          const createdUser = this.usersDatabase.createUser(data.userName, data.age, data.hobbies);

          res.writeHead(201).end(JSON.stringify(createdUser));
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  public async updateUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const [, userId] = req.url!.match(API_USERS_ID_REGEX)!;

    if (!uuid.validate(userId)) {
      res.writeHead(400).end(JSON.stringify({ message: 'invalid user id' }));
      return;
    }

    const user = this.usersDatabase.getUserById(userId);

    if (!user) {
      res.writeHead(404).end(JSON.stringify({ message: 'user does not exist' }));
      return;
    }

    return new Promise((resolve, reject) => {
      req.on('data', async (rawData) => {
        try {
          const stringifiedData = rawData.toString();
          const data = JSON.parse(stringifiedData);

          const updatedUser = this.usersDatabase.updateUserById(userId, data);

          res.writeHead(200).end(JSON.stringify(updatedUser));
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  public async deleteUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const [, userId] = req.url!.match(API_USERS_ID_REGEX)!;

    if (!uuid.validate(userId)) {
      res.writeHead(400).end(JSON.stringify({ message: 'invalid user id' }));
      return;
    }

    const user = this.usersDatabase.getUserById(userId);

    if (!user) {
      res.writeHead(404).end(JSON.stringify({ message: 'user does not exist' }));
      return;
    }

    this.usersDatabase.deleteUserById(userId);

    res.writeHead(204).end();
  }
}

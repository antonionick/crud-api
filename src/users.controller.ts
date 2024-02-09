import { IncomingMessage, ServerResponse } from 'node:http';
import { UsersService } from './users.service.js';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  public async handleAllUsersRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const users = await this.usersService.getAllUsers();

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    await this.writeDataToResponse(JSON.stringify(users), res);
    res.end();
  }

  private writeDataToResponse(data: string, res: ServerResponse): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const cb = (err: Error | null | undefined) => (err ? reject(err) : resolve(null));

      res.write(data, 'utf-8', cb);
    });
  }
}

import { UsersDatabase } from './users.database.js';
import { UserModel } from './users.model.js';

export class UsersService {
  constructor(private readonly usersDatabase: UsersDatabase) {}

  public async getAllUsers(): Promise<UserModel[]> {
    const users = await this.usersDatabase.getAllUsers();

    return users;
  }

  public async getUserById(id: string): Promise<UserModel> {
    const user = await this.usersDatabase.getUserById(id);

    return user;
  }
}

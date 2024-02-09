import { UserModel } from './users.model.js';

export class UsersDatabase {
  private readonly users: UserModel[] = [];

  public async getAllUsers(): Promise<UserModel[]> {
    return this.users;
  }
}

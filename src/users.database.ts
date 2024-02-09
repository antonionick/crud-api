import { UserModel } from './users.model.js';

export class UsersDatabase {
  private readonly storage = new Map<string, UserModel>();

  public async getAllUsers(): Promise<UserModel[]> {
    return Array.from(this.storage.values());
  }

  public async getUserById(id: string): Promise<UserModel> {
    const user = this.storage.get(id);
    return user!;
}
}

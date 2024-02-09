import { UserModel } from './users.model.js';

export class UsersDatabase {
  private readonly storage = new Map<string, UserModel>();

  public getAllUsers(): UserModel[] {
    return Array.from(this.storage.values());
  }

  public getUserById(id: string): UserModel {
    const user = this.storage.get(id);
    return user!;
  }

  public createUser(userName: string, age: number, hobbies: string[]): UserModel {
    const user = new UserModel(userName, age, hobbies);

    this.storage.set(user.id, user);

    return user;
  }

  public updateUserById(
    userId: string,
    userToUpdate: Partial<UserModel>,
  ): UserModel {
    const user = this.storage.get(userId)!;

    const updatedUser: UserModel = {
      ...user,
      ...userToUpdate,
    };

    Object.setPrototypeOf(updatedUser, UserModel.prototype);

    this.storage.set(userId, updatedUser);

    return updatedUser;
  }
}

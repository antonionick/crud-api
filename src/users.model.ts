import { randomUUID } from 'crypto';

export class UserModel {
  public readonly id = randomUUID();

  constructor(
    public readonly userName: string,
    public readonly age: number,
    public readonly hobbies: string[],
  ) {}
}

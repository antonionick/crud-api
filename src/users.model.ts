import * as uuid from 'uuid';

export class UserModel {
  public readonly id = uuid.v4();

  constructor(
    public readonly userName: string,
    public readonly age: number,
    public readonly hobbies: string[],
  ) {}
}

import { hashSync, compareSync, genSaltSync } from 'bcrypt';

export class BcryptAdapter {
  public hash(password: string): string {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  public compare(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}

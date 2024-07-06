import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export class BcryptAdapter {
  public hash(password: string): string {
    const salt = genSaltSync();

    return hashSync(password, salt);
  }

  public compare(password: string, hashed: string) {
    return compareSync(password, hashed);
  }
}

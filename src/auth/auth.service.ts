import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login() {
    return `This action generates a login`;
  }
  logout() {
    return `This action generates a logout`;
  }
}

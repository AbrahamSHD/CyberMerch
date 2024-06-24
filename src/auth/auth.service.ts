import { Injectable } from '@nestjs/common';
import { UserDto } from '../common/dtos/user.dto';

@Injectable()
export class AuthService {
  login(loginUserDto: UserDto) {
    return `This action generates a login`;
  }
  logout(logoutUserDto: UserDto) {
    return `This action generates a logout`;
  }
}

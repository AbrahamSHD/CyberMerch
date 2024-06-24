import { Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from '../common/dtos/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(':id')
  loginUser(@Param('id', ParseUUIDPipe) userDto: UserDto) {
    return this.authService.login(userDto);
  }

  @Post()
  logoutUser(@Param('id', ParseUUIDPipe) logoutUserDto: UserDto) {
    return this.authService.logout(logoutUserDto);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from '../common/interfaces';
import { User } from '../common/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginUser(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }

  @Post('logout')
  @Auth(ValidRoles.USER)
  logoutUser(@GetUser() user: User) {
    return this.authService.logout(user);
  }
}

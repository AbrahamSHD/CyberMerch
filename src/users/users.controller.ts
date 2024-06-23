import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from '../common/dtos/user.dto';
import { UpdateUserDto } from '../common/dtos/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../common/entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User was created',
    type: User,
    links: {
      self: {
        operationId: 'createUser',
        parameters: {
          name: '$response.body#/',
          tagName: '$response.body#/',
          email: '$response.body#/',
          password: '$response.body#/',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    links: {
      details: {
        operationId: 'getBadRequestDetails',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, Token Related',
    links: {
      tokenInfo: {
        operationId: 'getTokenInfo',
      },
    },
  })
  create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiResponse({
    status: 201,
    description: 'User was created',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.usersService.findOneByTerm(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}

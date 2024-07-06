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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../common/entities/user.entity';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../common/interfaces';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
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
  @Post('register')
  createUser(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 201,
    description: 'Get all users',
    links: {
      self: {
        operationId: 'findAll',
      },
    },
    type: User,
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
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Find a user by term (Id, tagName, email)' })
  @ApiResponse({
    status: 201,
    description: 'Get user by term: ["id", "tagName", "email"]',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Get(':term')
  findOneByTerm(@Param('term') term: string) {
    return this.usersService.findOneByTerm(term);
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Update user by id',
    type: User,
    links: {
      tokenInfo: {
        operationId: 'update',
        parameters: { id: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, Token Related',
    links: {
      tokenInfo: {
        operationId: 'update',
        parameters: { token: 'token' },
      },
    },
  })
  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Delete product by id',
    links: {
      tokenInfo: {
        operationId: 'delete',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, Token Related',
    links: {
      tokenInfo: {
        operationId: 'remove',
      },
    },
  })
  @Auth(ValidRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    description: 'Search by name, email, address, city, country or bio',
    required: false,
    type: String,
  })
  getAllUsers(
    @Query('page') page = 0,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.usersService.getAllUsers(Number(page), Number(limit), search);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({
    name: 'id',
    description: 'User id',
    required: true,
    type: String,
    example: '055e88dc-969d-44d4-850b-2a294b652702',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    example: {
      id: '055e88dc-969d-44d4-850b-2a294b652702',
      name: 'John Doe',
      email: 'john@example.com',
      phone: 123456789,
      address: '123 Main St',
      city: 'Anytown',
      country: 'USA',
      bio: 'Lorem ipsum dolor sit amet',
      role: 'user',
    },
  })
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}

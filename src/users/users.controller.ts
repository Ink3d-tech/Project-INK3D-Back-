import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from 'src/roles.enum';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';
import { AllowOwnerOrRole } from 'src/decorators/allow-owner-or-role.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @AllowOnlyRole(Role.Admin)
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
  @AllowOwnerOrRole(Role.Admin)
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

  @ApiBearerAuth()
  @AllowOwnerOrRole(Role.Admin)
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    name: 'id',
    description: 'User id',
    required: true,
    type: String,
    example: '055e88dc-969d-44d4-850b-2a294b652702',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User data to be updated',
    examples: {
      'user.update': {
        value: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: 123456789,
          address: '123 Main St',
          city: 'Anytown',
          country: 'USA',
          bio: 'Lorem asdafsasdf ipsum dolor sit amet',
        },
      },
    },
  })
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiBearerAuth()
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Activate user' })
  @ApiParam({
    name: 'id',
    description: 'User id',
    required: true,
    type: String,
    example: '055e88dc-969d-44d4-850b-2a294b652702',
  })
  @ApiResponse({
    status: 200,
    description: 'User activated successfully',
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
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @ApiBearerAuth()
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiParam({
    name: 'id',
    description: 'User id',
    required: true,
    type: String,
    example: '055e88dc-969d-44d4-850b-2a294b652702',
  })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
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
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.usersService.deActivate(id);
  }

  @Patch(':id/change-password')
  @ApiBearerAuth()
  @AllowOwnerOrRole(Role.Admin)
  @ApiOperation({ summary: 'Change password' })
  @ApiParam({
    name: 'id',
    description: 'User id',
    required: true,
    type: String,
    example: '055e88dc-969d-44d4-850b-2a294b652702',
  })
  @ApiBody({
    type: ChangePasswordDto,
    description: 'User data to be updated',
    examples: {
      'user.update': {
        value: {
          oldPassword: '123456789',
          newPassword: '987654321',
          confirmPassword: '987654321',
        },
      },
    },
  })
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @ApiBearerAuth()
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'id',
    description: 'User id',
    required: true,
    type: String,
    example: '055e88dc-969d-44d4-850b-2a294b652702',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
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
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';
import { Role } from 'src/roles.enum';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Create a new discount' })
  @ApiBody({
    type: CreateDiscountDto,
    examples: {
      'discount.create': {
        value: {
          amount: 10,
          status: 'active',
          expiresAt: new Date(),
          userId: '79062eed-7d51-431a-828c-db47feb9e3f7',
        },
      },
    },
  })
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountsService.create(createDiscountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discounts' })
  findAll() {
    return this.discountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a discount by ID' })
  findOne(@Param('id') id: string) {
    return this.discountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a discount' })
  @ApiBody({
    type: UpdateDiscountDto,
    examples: {
      'discount.update': {
        value: {
          amount: 10,
          status: 'active',
          expiresAt: new Date(),
          userId: '79062eed-7d51-431a-828c-db47feb9e3f7',
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountsService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a discount' })
  remove(@Param('id') id: string) {
    return this.discountsService.remove(id);
  }
}

// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
// } from '@nestjs/common';
// import { DiscountsService } from './discounts.service';
// import { CreateDiscountDto } from './dto/create-discount.dto';
// import { UpdateDiscountDto } from './dto/update-discount.dto';
// import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';
// import { Role } from 'src/roles.enum';
// import { AllowOwnerOrRole } from 'src/decorators/allow-owner-or-role.decorator';

// @Controller('discounts')
// export class DiscountsController {
//   constructor(private readonly discountsService: DiscountsService) {}

//   @ApiBearerAuth()
//   @UseGuards(AuthGuard, RolesGuard)
//   @AllowOnlyRole(Role.Admin)
//   @Post()
//   @ApiOperation({ summary: 'Create a new discount' })
//   @ApiBody({
//     type: CreateDiscountDto,
//     examples: {
//       'discount.create': {
//         value: {
//           amount: 10,
//           status: 'active',
//           expiresAt: new Date(),
//           userId: '79062eed-7d51-431a-828c-db47feb9e3f7',
//         },
//       },
//     },
//   })
//   create(@Body() createDiscountDto: CreateDiscountDto) {
//     return this.discountsService.create(createDiscountDto);
//   }

//   @ApiBearerAuth()
//   @UseGuards(AuthGuard, RolesGuard)
//   @AllowOnlyRole(Role.Admin)
//   @Get()
//   @ApiOperation({ summary: 'Get all discounts' })
//   findAll() {
//     return this.discountsService.findAll();
//   }

//   @ApiBearerAuth()
//   @UseGuards(AuthGuard, RolesGuard)
//   @AllowOwnerOrRole(Role.Admin)
//   @Get(':id')
//   @ApiOperation({ summary: 'Get a discount by ID' })
//   findOne(@Param('id') id: string) {
//     return this.discountsService.findOne(id);
//   }

//   @ApiBearerAuth()
//   @UseGuards(AuthGuard, RolesGuard)
//   @AllowOnlyRole(Role.Admin)
//   @Patch(':id')
//   @ApiOperation({ summary: 'Update a discount' })
//   @ApiBody({
//     type: UpdateDiscountDto,
//     examples: {
//       'discount.update': {
//         value: {
//           amount: 10,
//           status: 'active',
//           expiresAt: new Date(),
//           userId: '79062eed-7d51-431a-828c-db47feb9e3f7',
//         },
//       },
//     },
//   })
//   update(
//     @Param('id') id: string,
//     @Body() updateDiscountDto: UpdateDiscountDto,
//   ) {
//     return this.discountsService.update(id, updateDiscountDto);
//   }

//   @ApiBearerAuth()
//   @UseGuards(AuthGuard, RolesGuard)
//   @AllowOnlyRole(Role.Admin)
//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete a discount' })
//   remove(@Param('id') id: string) {
//     return this.discountsService.remove(id);
//   }
// }



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
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';
import { Role } from 'src/roles.enum';
import { AllowOwnerOrRole } from 'src/decorators/allow-owner-or-role.decorator';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get('code/:code')
  @ApiOperation({ summary: 'Obtener un descuento por código' })
  findByCode(@Param('code') code: string) {
    return this.discountsService.findByCode(code);
  }

  @Post('use/:code')
@ApiOperation({ summary: 'Aplicar un código de descuento' })
applyDiscount(@Param('code') code: string) {
  return this.discountsService.applyDiscount(code);
}



  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @Post()
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @Get()
  @ApiOperation({ summary: 'Get all discounts' })
  findAll() {
    return this.discountsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOwnerOrRole(Role.Admin)
  @Get(':id')
  @ApiOperation({ summary: 'Get a discount by ID' })
  findOne(@Param('id') id: string) {
    return this.discountsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a discount' })
  remove(@Param('id') id: string) {
    return this.discountsService.remove(id);
  }
}

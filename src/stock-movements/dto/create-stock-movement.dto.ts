// import { IsUUID, IsInt, Min, IsIn, IsOptional } from 'class-validator';

// export class CreateStockMovementDto {
//   @IsUUID()
//   productId: string;

//   @IsInt()
//   @Min(1, { message: 'La cantidad debe ser mayor a 0' })
//   quantity: number;

//   @IsIn(
//     ['purchase', 'manual_adjustment', 'order_creation', 'order_cancellation'],
//     {
//       message:
//         'El tipo de movimiento debe ser purchase, manual_adjustment, order_creation o order_cancellation',
//     },
//   )
//   type:
//     | 'initial-stock'
//     | 'purchase'
//     | 'manual_adjustment'
//     | 'order_creation'
//     | 'order_cancellation';
//   @IsOptional()
//   reason?: string;
// }


// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsInt, Min, IsEnum, IsOptional } from 'class-validator';

// export class CreateStockMovementDto {
//   @ApiProperty({ example: '1fe09b55-d8af-4f82-ac8d-b82489af2d70', description: 'ID del producto' })
//   @IsString()
//   productId: string;

//   @ApiProperty({ example: 10, description: 'Cantidad de stock movida' })
//   @IsInt()
//   @Min(1)
//   quantity: number;

//   @ApiProperty({
//     example: 'manual_add',
//     description: 'Tipo de movimiento de stock',
//     enum: ['initial_stock', 'supplies_purchase', 'manual_add', 'order_creation', 'order_cancellation', 'manual_take'],
//   })
//   @IsEnum(['initial_stock', 'supplies_purchase', 'manual_add', 'order_creation', 'order_cancellation', 'manual_take'])
//   type: string;

//   @ApiProperty({ example: 'Ajuste de inventario', description: 'Motivo del movimiento', required: false })
//   @IsString()
//   @IsOptional()
//   reason?: string;
// }



import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsEnum, IsOptional } from 'class-validator';

export class CreateStockMovementDto {
  @ApiProperty({ example: '1fe09b55-d8af-4f82-ac8d-b82489af2d70', description: 'ID del producto' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 10, description: 'Cantidad de stock movida' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 50, description: 'Stock antes del movimiento' }) // 👈 Nuevo campo
  @IsInt()
  @Min(0)
  previousStock: number;

  @ApiProperty({ example: 60, description: 'Stock después del movimiento' }) // 👈 Nuevo campo
  @IsInt()
  @Min(0)
  newStock: number;

  @ApiProperty({
    example: 'manual_add',
    description: 'Tipo de movimiento de stock',
    enum: ['initial_stock', 'supplies_purchase', 'manual_add', 'order_creation', 'order_cancellation', 'manual_take'],
  })
  @IsEnum(['initial_stock', 'supplies_purchase', 'manual_add', 'order_creation', 'order_cancellation', 'manual_take'])
  type: string;

  @ApiProperty({ example: 'Ajuste de inventario', description: 'Motivo del movimiento', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}


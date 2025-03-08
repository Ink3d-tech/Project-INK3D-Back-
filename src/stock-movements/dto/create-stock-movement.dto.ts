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
//     | 'purchase'
//     | 'manual_adjustment'
//     | 'order_creation'
//     | 'order_cancellation';
//   @IsOptional()
//   reason?: string;
// }

// create-stock-movement.dto.ts

// create-stock-movement.dto.ts
import { IsUUID, IsInt, Min, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateStockMovementDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  quantity: number;

  @IsIn(
    ['purchase', 'manual_adjustment', 'order_creation', 'order_cancellation'],
    {
      message:
        'El tipo de movimiento debe ser purchase, manual_adjustment, order_creation o order_cancellation',
    },
  )
  type:
    | 'purchase'
    | 'manual_adjustment'
    | 'order_creation'
    | 'order_cancellation';

  @IsOptional()  // Hacemos 'size' opcional
  @IsString()
  size?: string; // El campo de talla es ahora opcional

  @IsOptional()
  reason?: string;
}

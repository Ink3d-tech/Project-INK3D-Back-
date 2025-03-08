// src/finance/dto/create-transaction.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  userId: string; // ID del usuario que realiza la transacción

  @IsNotEmpty()
  @IsString()
  orderId: string; // ID de la orden a la que se asocia la transacción

  @IsNotEmpty()
  @IsNumber()
  amount: number; // Monto de la transacción

  @IsNotEmpty()
  @IsEnum(['payment', 'refund'])
  type: 'payment' | 'refund'; 

  @IsNotEmpty()
  @IsEnum(['completed', 'failed', 'pending'])
  status: 'completed' | 'failed' | 'pending'; 
}

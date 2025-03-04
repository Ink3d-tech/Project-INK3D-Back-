// src/finance/dto/update-transaction.dto.ts
import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateTransactionDto {
  @IsNotEmpty()
  @IsEnum(['completed', 'failed', 'pending'])
  status: 'completed' | 'failed' | 'pending'; 
}

import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDate,
} from 'class-validator';
import { User } from 'src/entities/user.entity';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsEnum(['active', 'expired', 'used'])
  status: 'active' | 'expired' | 'used';

  @IsOptional()
  @IsDate()
  expiresAt: Date | null;

  @IsOptional()
  user: User | null; // Cambiado de userId (string) a un objeto User
}

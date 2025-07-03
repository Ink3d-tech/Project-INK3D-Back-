import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/match-password.decorator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/^(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/^(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least one special character',
  })
  password: string;

  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'El número de teléfono solo puede contener dígitos',
  })
  @Length(10, 15, {
    message: 'El número de teléfono debe tener entre 10 y 15 dígitos',
  })
  phone: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  role?: string; // Se maneja desde el front-end
}

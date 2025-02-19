import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { MatchPassword } from 'src/decorators/match-password.decorator';

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Validate(MatchPassword, ['newPassword'])
  confirmPassword: string;
}

import { IsString, IsOptional } from 'class-validator';

export class UpdateMagazineDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  author?: string; // También como string
}

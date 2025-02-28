import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCombinationDto } from './product-combination.dto';
import { IsUUID } from 'class-validator';

export class UpdateProductCombinationDto extends PartialType(
  CreateProductCombinationDto,
) {
  @IsUUID()
  id: string;
}

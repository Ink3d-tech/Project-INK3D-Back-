// import { IsString, IsNotEmpty } from 'class-validator';

// export class CreateCommentDto {
//   @IsString()
//   @IsNotEmpty()
//   text: string;

//   @IsString()
//   @IsNotEmpty()
//   username: string;
// }



import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  

export class CreateCommentDto {
  @ApiProperty({
    description: 'Texto del comentario',
    type: String,
    example: 'Gran artículo, muy interesante.',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'Nombre de usuario del comentarista',
    type: String,
    example: 'usuario123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}

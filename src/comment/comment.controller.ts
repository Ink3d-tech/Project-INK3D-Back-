// import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
// import { CommentService } from './comment.service';
// import { CreateCommentDto } from './dto/create-comment.dto';
// import { Comment } from 'src/entities/comment.entity';

// @Controller('api/comments')
// export class CommentController {
//   constructor(private readonly commentService: CommentService) {}

//   @Post(':magazineId')
//   create(
//     @Param('magazineId') magazineId: string,
//     @Body() createCommentDto: CreateCommentDto,
//   ): Promise<Comment> {
//     return this.commentService.create(magazineId, createCommentDto);
//   }

//   @Get(':magazineId')
//   findByMagazine(@Param('magazineId') magazineId: string): Promise<Comment[]> {
//     return this.commentService.findByMagazine(magazineId);
//   }

//   @Delete(':id')
//   delete(@Param('id') id: string): Promise<void> {
//     return this.commentService.delete(id);
//   }
// }



import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';  
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from 'src/entities/comment.entity';

@ApiTags('comments')  
@Controller('api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':magazineId')
  @ApiOperation({ summary: 'Crear un comentario para una revista' })  
  @ApiParam({ name: 'magazineId', description: 'ID de la revista a la que se agregará el comentario' }) 
  @ApiBody({ type: CreateCommentDto })  
  @ApiResponse({ status: 201, description: 'Comentario creado con éxito', type: Comment })  
  @ApiResponse({ status: 404, description: 'Revista no encontrada' })  
  create(
    @Param('magazineId') magazineId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.create(magazineId, createCommentDto);
  }

  @Get(':magazineId')
  @ApiOperation({ summary: 'Obtener los comentarios de una revista' })
  @ApiParam({ name: 'magazineId', description: 'ID de la revista' })
  @ApiResponse({ status: 200, description: 'Lista de comentarios', type: [Comment] })
  findByMagazine(@Param('magazineId') magazineId: string): Promise<Comment[]> {
    return this.commentService.findByMagazine(magazineId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un comentario' })
  @ApiParam({ name: 'id', description: 'ID del comentario' })
  @ApiResponse({ status: 204, description: 'Comentario eliminado con éxito' })
  delete(@Param('id') id: string): Promise<void> {
    return this.commentService.delete(id);
  }
}

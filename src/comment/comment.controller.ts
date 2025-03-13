import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from 'src/entities/comment.entity';

@Controller('api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':magazineId')
  create(
    @Param('magazineId') magazineId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.create(magazineId, createCommentDto);
  }

  @Get(':magazineId')
  findByMagazine(@Param('magazineId') magazineId: string): Promise<Comment[]> {
    return this.commentService.findByMagazine(magazineId);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.commentService.delete(id);
  }
}

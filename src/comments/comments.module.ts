import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Magazine } from 'src/entities/magazine.entity';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MagazineModule } from 'src/magazine/magazine.module';
import { Comment } from 'src/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Magazine, User]),
MagazineModule],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}

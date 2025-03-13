import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Magazine } from 'src/entities/magazine.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Magazine)
    private readonly magazineRepository: Repository<Magazine>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addComment(userId: string, magazineId: string, content: string): Promise<Comment> {
    this.logger.log(`Añadiendo comentario - userId: ${userId}, magazineId: ${magazineId}, content: ${content}`);
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`Usuario no encontrado con ID: ${userId}`);
      throw new Error('Usuario no encontrado');
    }

    const magazine = await this.magazineRepository.findOne({ where: { id: magazineId } });
    if (!magazine) {
      this.logger.error(`Magazine no encontrada con ID: ${magazineId}`);
      throw new Error('Magazine no encontrada');
    }

    const newComment = this.commentRepository.create({ content, user, magazine });
    this.logger.log(`Comentario creado: ${JSON.stringify(newComment)}`);
    return this.commentRepository.save(newComment);
  }

  async getCommentsByMagazine(magazineId: string): Promise<Comment[]> {
    this.logger.log(`Obteniendo comentarios para magazineId: ${magazineId}`);
    return this.commentRepository.find({
      where: { magazine: { id: magazineId } },
      relations: ['user'],
    });
  }
}

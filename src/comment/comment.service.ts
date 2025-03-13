// // este sirve en el post y get
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Magazine } from 'src/entities/magazine.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Magazine)
    private magazineRepository: Repository<Magazine>,
  ) {}

  async create(magazineId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    const magazine = await this.magazineRepository.findOne({ where: { id: magazineId } });
    if (!magazine) {
      throw new Error('Magazine not found');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      magazine,
    });

    return this.commentRepository.save(comment);
  }

  findByMagazine(magazineId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { magazine: { id: magazineId } },
      relations: ['magazine'],
    });
  }

  async delete(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }
}



// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Comment } from 'src/entities/comment.entity';
// import { CreateCommentDto } from './dto/create-comment.dto';
// import { Magazine } from 'src/entities/magazine.entity';
// import { Server } from 'socket.io';

// @Injectable()
// export class CommentService {
//   private server: Server; // Servidor WebSocket

//   constructor(
//     @InjectRepository(Comment)
//     private commentRepository: Repository<Comment>,
//     @InjectRepository(Magazine)
//     private magazineRepository: Repository<Magazine>,
//   ) {}

//   // 🔥 Método para conectar WebSockets desde main.ts
//   setSocketServer(server: Server) {
//     this.server = server;
//   }

//   async create(magazineId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
//     const magazine = await this.magazineRepository.findOne({ where: { id: magazineId } });
//     if (!magazine) {
//       throw new Error('Magazine not found');
//     }

//     const comment = this.commentRepository.create({
//       ...createCommentDto,
//       magazine,
//     });

//     const savedComment = await this.commentRepository.save(comment);

//     // 🔥 Emitir el nuevo comentario por WebSocket si el server está disponible
//     if (this.server) {
//       this.server.emit('updateComments', savedComment);
//     }

//     return savedComment;
//   }

//   findByMagazine(magazineId: string): Promise<Comment[]> {
//     return this.commentRepository.find({
//       where: { magazine: { id: magazineId } },
//       relations: ['magazine'],
//     });
//   }

//   async delete(id: string): Promise<void> {
//     await this.commentRepository.delete(id);
//   }
// }

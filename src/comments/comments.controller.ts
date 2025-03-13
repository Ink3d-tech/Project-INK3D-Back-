import { Controller, Post, Get, Body, Param, UseGuards, Req, Logger } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';
import { Role } from 'src/roles.enum';
import { AllowOwnerOrRole } from 'src/decorators/allow-owner-or-role.decorator';


@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {}

   @UseGuards(AuthGuard, RolesGuard)
   @AllowOwnerOrRole(Role.User)
  @Post(':magazineId')
  async addComment(
    @Param('magazineId') magazineId: string,
    @Body('content') content: string,
    @Req() req
  ) {
    this.logger.debug(`📩 Recibida solicitud para agregar comentario a la revista ${magazineId}`);
    this.logger.debug(`🔹 Cuerpo del comentario: ${content}`);
    this.logger.debug(`👤 Usuario autenticado: ${JSON.stringify(req.user)}`);

    if (!req.user || !req.user.id) {
      this.logger.error('❌ Error: req.user o req.user.id es undefined');
      throw new Error('Usuario no autenticado');
    }

    return this.commentsService.addComment(req.user.id, magazineId, content);
  }

  @Get(':magazineId')
  async getComments(@Param('magazineId') magazineId: string) {
    this.logger.debug(`📖 Recuperando comentarios para la revista ${magazineId}`);
    return this.commentsService.getCommentsByMagazine(magazineId);
  }
}
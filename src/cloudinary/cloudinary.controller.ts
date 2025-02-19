
import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post(':folder?')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder?: string
  ) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo');
    }

    console.log(file);
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo no es una imagen válida');
    }

    return this.cloudinaryService.uploadImage(file, folder ?? 'uploads'); 
  }

  @Delete(':publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    return this.cloudinaryService.deleteImage(publicId);
  }
}



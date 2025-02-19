import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiOptions, DeleteApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('🌍 Cloudinary Config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '🔑 (set)' : '❌ (missing)',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '🔒 (set)' : '❌ (missing)',
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
    console.log('📤 Subiendo imagen a Cloudinary:', {
      nombre: file.originalname,
      tamaño: file.size,
      tipo: file.mimetype,
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            console.error('❌ Error al subir a Cloudinary:', error);
            return reject(new InternalServerErrorException('Error al subir la imagen a Cloudinary'));
          }
          console.log('✅ Imagen subida con éxito:', result);
          resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<DeleteApiResponse> {
    try {
      console.log(`🗑 Eliminando imagen con ID: ${publicId}`);
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('❌ Error al eliminar imagen:', error);
      throw new InternalServerErrorException('Error al eliminar la imagen de Cloudinary');
    }
  }
}

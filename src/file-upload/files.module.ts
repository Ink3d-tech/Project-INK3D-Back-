import { TypeOrmModule } from "@nestjs/typeorm";

import { FileUploadController } from "./files.controller";
import { FileUploadService } from "./files.service";
import { FileUploadRepository } from "./files.repository";
import { Module } from "@nestjs/common";
import { Product } from "src/entities/product.entity";
import { CloudinaryConfig } from "src/config/cloudinary";


@Module({
    imports:[ TypeOrmModule.forFeature([Product])],
    controllers: [FileUploadController],
    providers: [FileUploadService,CloudinaryConfig,FileUploadRepository],
})
export class FileUploadModule {}
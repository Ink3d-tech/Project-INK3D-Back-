import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileUploadService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Files') // Agrega una etiqueta para Swagger
@Controller('files')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) {}

    @Post('uploadImage/:productId')
    @UseInterceptors(FileInterceptor('file'))
 
    @ApiOperation({ summary: 'Subir imagen de producto' }) 
    @ApiConsumes('multipart/form-data') 
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary', 
                },
            },
        },
    })
    async uploadProductImage(
        @Param('productId', ParseUUIDPipe) productId: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: 600000,
                        message: 'El tamaño del archivo debe ser inferior a 200kb',
                    }),
                    new FileTypeValidator({
                        fileType: /(jpg|jpeg|png|webp)$/,
                    }),
                ],
            }),
        ) file: Express.Multer.File,
    ) {
        return this.fileUploadService.uploadProductImage(file, productId);
    }
}

import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/roles.enum';
import { AllowOwnerOrRole } from 'src/decorators/allow-owner-or-role.decorator';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';

@Controller('file')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Upload image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
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
  @ApiResponse({
    status: 200,
    description: 'Image uploaded',
  })
  @ApiResponse({
    status: 400,
    example: {
      message: 'Validation failed',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiResponse({
    status: 401,
    example: {
      message: 'Invalid token',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    example: {
      message: 'You do not have permission to access this resource!',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    example: {
      message: 'Product not found',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.uploadImage(file);
  }

  @ApiTags('Products')
  @Post('uploadImage/:productId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
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
  @ApiResponse({
    status: 200,
    description: 'Image uploaded',
  })
  @ApiResponse({
    status: 400,
    example: {
      message: 'Validation failed',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiResponse({
    status: 401,
    example: {
      message: 'Invalid token',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    example: {
      message: 'You do not have permission to access this resource!',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    example: {
      message: 'Product not found',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  async uploadProductImage(
    @Param('productId', ParseUUIDPipe) productId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 600000,
            message: 'File must be maximum 600kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileUploadService.uploadProductImage(file, productId);
  }

  @ApiTags('Users')
  @Post('uploadImage/user/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOwnerOrRole(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
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
  @ApiResponse({
    status: 200,
    description: 'Image uploaded',
  })
  @ApiResponse({
    status: 400,
    example: {
      message: 'Validation failed',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiResponse({
    status: 401,
    example: {
      message: 'Invalid token',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    example: {
      message: 'You do not have permission to access this resource!',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    example: {
      message: 'User not found',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  async uploadUserImage(
    @Param('userId', ParseUUIDPipe) userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 600000,
            message: 'File must be maximum 200kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileUploadService.uploadUserImage(file, userId);
  }
}

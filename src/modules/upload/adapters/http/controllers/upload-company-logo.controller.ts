import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UploadFileResponseDto } from '@src/modules/upload/adapters/http/dto/response/upload-file.response.dto';
import { UploadFileService } from '@src/shared/storage/services/upload-file.service';
import type { UploadedFileInterface } from '@src/shared/storage/contracts/uploaded-file.interface';
import { UploadFolderEnum } from '@src/shared/storage/enums/upload-folder.enum';
import { UploadResourceEnum } from '@src/shared/storage/enums/upload-resource.enum';

const IMAGE_MIME_TYPES = [
  'image/svg+xml',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/avif',
];

const IMAGE_EXTENSIONS = [
  '.svg',
  '.png',
  '.jpeg',
  '.jpg',
  '.webp',
  '.gif',
  '.avif',
];

const IMAGE_MIME_TYPES_REGEX = new RegExp(
  `(${IMAGE_MIME_TYPES.join('|')})$`,
  'i',
);

@ApiTags('Upload')
@ApiBearerAuth('JWT')
@Controller('upload')
export class UploadCompanyLogoController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @ApiOperation({ summary: 'Upload recruiter company logo' })
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
      required: ['file'],
    },
  })
  @ApiCreatedResponse({
    description: 'Company logo uploaded successfully.',
    type: UploadFileResponseDto,
  })
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @UseInterceptors(FileInterceptor('file'))
  @Post('company-logo')
  async handle(
    @CurrentUser() user: AuthUserPayload,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message:
              'O tamanho da logo excede o limite máximo permitido de 5MB.',
          }),
          new FileTypeValidator({
            fileType: IMAGE_MIME_TYPES_REGEX,
          }),
        ],
      }),
    )
    file: UploadedFileInterface,
  ): Promise<UploadFileResponseDto> {
    return this.uploadFileService.execute({
      file,
      userId: user.id,
      folder: UploadFolderEnum.LOGOS,
      resource: UploadResourceEnum.COMPANY_LOGO,
      allowedMimeTypes: IMAGE_MIME_TYPES,
      allowedExtensions: IMAGE_EXTENSIONS,
      maxSizeInBytes: 5 * 1024 * 1024,
    });
  }
}

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

@ApiTags('Upload')
@ApiBearerAuth('JWT')
@Controller('upload')
export class UploadCandidateResumeController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @ApiOperation({ summary: 'Upload candidate resume PDF' })
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
    description: 'Candidate resume uploaded successfully.',
    type: UploadFileResponseDto,
  })
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.CANDIDATE)
  @UseInterceptors(FileInterceptor('file'))
  @Post('candidate-resume')
  async handle(
    @CurrentUser() user: AuthUserPayload,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024, // Limite estrito de 10MB para currículos
            message:
              'O tamanho do currículo excede o limite máximo permitido de 10MB.',
          }),
          new FileTypeValidator({
            fileType: 'application/pdf', // Garante que só passa PDF puro na API
          }),
        ],
      }),
    )
    file: UploadedFileInterface,
  ): Promise<UploadFileResponseDto> {
    return this.uploadFileService.execute({
      file,
      userId: user.id,
      folder: UploadFolderEnum.RESUMES,
      resource: UploadResourceEnum.CANDIDATE_RESUME,
      allowedMimeTypes: ['application/pdf'],
      allowedExtensions: ['.pdf'],
      maxSizeInBytes: 10 * 1024 * 1024,
    });
  }
}

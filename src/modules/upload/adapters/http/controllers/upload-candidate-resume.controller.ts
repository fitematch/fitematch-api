import {
  Controller,
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
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  @Post('candidate-resume')
  async handle(
    @CurrentUser() user: AuthUserPayload,
    @UploadedFile() file?: UploadedFileInterface,
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

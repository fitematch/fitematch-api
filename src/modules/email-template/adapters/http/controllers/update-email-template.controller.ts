import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRoles } from '@src/modules/auth/adapters/http/decorators/admin-roles.decorator';
import { AdminRoleGuard } from '@src/modules/auth/adapters/http/guards/admin-role.guard';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { UPDATE_EMAIL_TEMPLATE_USE_CASE } from '@src/modules/email-template/application/contracts/tokens/email-template.tokens';
import type { UpdateEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/update-email-template.use-case.interface';
import { UpdateEmailTemplateParamsDto } from '@src/modules/email-template/adapters/http/dto/request/update-email-template.params.dto';
import { UpdateEmailTemplateRequestDto } from '@src/modules/email-template/adapters/http/dto/request/update-email-template.request.dto';
import { EmailTemplateResponseDto } from '@src/modules/email-template/adapters/http/dto/response/email-template.response.dto';
import { EmailTemplateMapper } from '@src/modules/email-template/adapters/http/mappers/email-template.mapper';
import { UpdateEmailTemplateRequestMapper } from '@src/modules/email-template/adapters/http/mappers/update-email-template-request.mapper';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

@ApiTags('Email Template')
@ApiBearerAuth('JWT')
@Controller('email-template')
export class UpdateEmailTemplateController {
  constructor(
    @Inject(UPDATE_EMAIL_TEMPLATE_USE_CASE)
    private readonly updateEmailTemplateUseCase: UpdateEmailTemplateUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Update email template',
    description: 'Updates subject, preheader and body of an email template.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'Email template updated successfully.',
    type: EmailTemplateResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Email template not found.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRoleEnum.ADMIN, AdminRoleEnum.SUPER_ADMIN)
  @Patch(':id')
  async handle(
    @Param() params: UpdateEmailTemplateParamsDto,
    @Body() body: UpdateEmailTemplateRequestDto,
  ): Promise<EmailTemplateResponseDto> {
    const result = await this.updateEmailTemplateUseCase.execute(
      UpdateEmailTemplateRequestMapper.toInput(params, body),
    );

    if (!result) {
      throw new NotFoundException('Email template not found.');
    }

    return EmailTemplateMapper.toResponse(result);
  }
}

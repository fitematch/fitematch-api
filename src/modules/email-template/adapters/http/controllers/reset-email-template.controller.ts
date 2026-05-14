import {
  Controller,
  Inject,
  NotFoundException,
  Param,
  Post,
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
import { RESET_EMAIL_TEMPLATE_USE_CASE } from '@src/modules/email-template/application/contracts/tokens/email-template.tokens';
import type { ResetEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/reset-email-template.use-case.interface';
import { ResetEmailTemplateParamsDto } from '@src/modules/email-template/adapters/http/dto/request/reset-email-template.params.dto';
import { EmailTemplateResponseDto } from '@src/modules/email-template/adapters/http/dto/response/email-template.response.dto';
import { EmailTemplateMapper } from '@src/modules/email-template/adapters/http/mappers/email-template.mapper';
import { ResetEmailTemplateRequestMapper } from '@src/modules/email-template/adapters/http/mappers/reset-email-template-request.mapper';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

@ApiTags('Email Template')
@ApiBearerAuth('JWT')
@Controller('email-template')
export class ResetEmailTemplateController {
  constructor(
    @Inject(RESET_EMAIL_TEMPLATE_USE_CASE)
    private readonly resetEmailTemplateUseCase: ResetEmailTemplateUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Reset email template',
    description: 'Restores an email template to its default content.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'Email template reset successfully.',
    type: EmailTemplateResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Email template not found.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRoleEnum.ADMIN, AdminRoleEnum.SUPER_ADMIN)
  @Post(':id/reset')
  async handle(
    @Param() params: ResetEmailTemplateParamsDto,
  ): Promise<EmailTemplateResponseDto> {
    const result = await this.resetEmailTemplateUseCase.execute(
      ResetEmailTemplateRequestMapper.toInput(params),
    );

    if (!result) {
      throw new NotFoundException('Email template not found.');
    }

    return EmailTemplateMapper.toResponse(result);
  }
}

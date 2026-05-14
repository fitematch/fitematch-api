import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
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
import { READ_EMAIL_TEMPLATE_USE_CASE } from '@src/modules/email-template/application/contracts/tokens/email-template.tokens';
import type { ReadEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/read-email-template.use-case.interface';
import { ReadEmailTemplateParamsDto } from '@src/modules/email-template/adapters/http/dto/request/read-email-template.params.dto';
import { EmailTemplateResponseDto } from '@src/modules/email-template/adapters/http/dto/response/email-template.response.dto';
import { EmailTemplateMapper } from '@src/modules/email-template/adapters/http/mappers/email-template.mapper';
import { ReadEmailTemplateRequestMapper } from '@src/modules/email-template/adapters/http/mappers/read-email-template-request.mapper';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

@ApiTags('Email Template')
@ApiBearerAuth('JWT')
@Controller('email-template')
export class ReadEmailTemplateController {
  constructor(
    @Inject(READ_EMAIL_TEMPLATE_USE_CASE)
    private readonly readEmailTemplateUseCase: ReadEmailTemplateUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Read email template',
    description: 'Returns an email template by id.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'Email template returned successfully.',
    type: EmailTemplateResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Email template not found.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRoleEnum.ADMIN, AdminRoleEnum.SUPER_ADMIN)
  @Get(':id')
  async handle(
    @Param() params: ReadEmailTemplateParamsDto,
  ): Promise<EmailTemplateResponseDto> {
    const result = await this.readEmailTemplateUseCase.execute(
      ReadEmailTemplateRequestMapper.toInput(params),
    );

    if (!result) {
      throw new NotFoundException('Email template not found.');
    }

    return EmailTemplateMapper.toResponse(result);
  }
}

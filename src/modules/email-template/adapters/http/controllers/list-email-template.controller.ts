import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRoles } from '@src/modules/auth/adapters/http/decorators/admin-roles.decorator';
import { AdminRoleGuard } from '@src/modules/auth/adapters/http/guards/admin-role.guard';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { LIST_EMAIL_TEMPLATE_USE_CASE } from '@src/modules/email-template/application/contracts/tokens/email-template.tokens';
import type { ListEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/list-email-template.use-case.interface';
import { EmailTemplateResponseDto } from '@src/modules/email-template/adapters/http/dto/response/email-template.response.dto';
import { EmailTemplateMapper } from '@src/modules/email-template/adapters/http/mappers/email-template.mapper';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

@ApiTags('Email Template')
@ApiBearerAuth('JWT')
@Controller('email-template')
export class ListEmailTemplateController {
  constructor(
    @Inject(LIST_EMAIL_TEMPLATE_USE_CASE)
    private readonly listEmailTemplateUseCase: ListEmailTemplateUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'List all email templates',
    description: 'Returns the list of all email templates.',
  })
  @ApiOkResponse({
    description: 'Email templates listed successfully.',
    type: EmailTemplateResponseDto,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRoleEnum.ADMIN, AdminRoleEnum.SUPER_ADMIN)
  @Get()
  async handle(): Promise<EmailTemplateResponseDto[]> {
    const result = await this.listEmailTemplateUseCase.execute();

    return EmailTemplateMapper.toResponseList(result);
  }
}

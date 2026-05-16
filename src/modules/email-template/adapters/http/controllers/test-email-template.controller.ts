import {
  Body,
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
import { TEST_EMAIL_TEMPLATE_USE_CASE } from '@src/modules/email-template/application/contracts/tokens/email-template.tokens';
import type { TestEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/test-email-template.use-case.interface';
import { TestEmailTemplateParamsDto } from '@src/modules/email-template/adapters/http/dto/request/test-email-template.params.dto';
import { TestEmailTemplateRequestDto } from '@src/modules/email-template/adapters/http/dto/request/test-email-template.request.dto';
import { TestEmailTemplateResponseDto } from '@src/modules/email-template/adapters/http/dto/response/test-email-template.response.dto';
import { TestEmailTemplateMapper } from '@src/modules/email-template/adapters/http/mappers/test-email-template.mapper';
import { TestEmailTemplateRequestMapper } from '@src/modules/email-template/adapters/http/mappers/test-email-template-request.mapper';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

@ApiTags('Email Template')
@ApiBearerAuth('JWT')
@Controller('email-templates')
export class TestEmailTemplateController {
  constructor(
    @Inject(TEST_EMAIL_TEMPLATE_USE_CASE)
    private readonly testEmailTemplateUseCase: TestEmailTemplateUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Send test email template',
    description: 'Renders a template with fake values and sends a test email.',
  })
  @ApiParam({ name: 'slug', type: String })
  @ApiOkResponse({
    description: 'Test email sent successfully.',
    type: TestEmailTemplateResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Email template not found.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AdminRoles(AdminRoleEnum.ADMIN, AdminRoleEnum.SUPER_ADMIN)
  @Post(':slug/test')
  async handle(
    @Param() params: TestEmailTemplateParamsDto,
    @Body() body: TestEmailTemplateRequestDto,
  ): Promise<TestEmailTemplateResponseDto> {
    const result = await this.testEmailTemplateUseCase.execute(
      TestEmailTemplateRequestMapper.toInput(params, body),
    );

    if (!result) {
      throw new NotFoundException('Email template not found.');
    }

    return TestEmailTemplateMapper.toResponse(result);
  }
}

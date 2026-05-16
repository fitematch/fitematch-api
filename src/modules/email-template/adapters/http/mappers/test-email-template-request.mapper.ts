import type { TestEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/test-email-template.input.dto';
import type { TestEmailTemplateParamsDto } from '@src/modules/email-template/adapters/http/dto/request/test-email-template.params.dto';
import type { TestEmailTemplateRequestDto } from '@src/modules/email-template/adapters/http/dto/request/test-email-template.request.dto';

export class TestEmailTemplateRequestMapper {
  static toInput(
    params: TestEmailTemplateParamsDto,
    body: TestEmailTemplateRequestDto,
  ): TestEmailTemplateInputDto {
    return {
      slug: params.slug,
      email: body.email,
    };
  }
}

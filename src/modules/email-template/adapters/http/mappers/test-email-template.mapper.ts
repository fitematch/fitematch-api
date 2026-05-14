import type { TestEmailTemplateResponseDto } from '@src/modules/email-template/adapters/http/dto/response/test-email-template.response.dto';
import type { TestEmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/test-email-template.output.dto';

export class TestEmailTemplateMapper {
  static toResponse(
    output: TestEmailTemplateOutputDto,
  ): TestEmailTemplateResponseDto {
    return {
      message: output.message,
    };
  }
}

import type { ResetEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/reset-email-template.input.dto';
import type { ResetEmailTemplateParamsDto } from '@src/modules/email-template/adapters/http/dto/request/reset-email-template.params.dto';

export class ResetEmailTemplateRequestMapper {
  static toInput(
    params: ResetEmailTemplateParamsDto,
  ): ResetEmailTemplateInputDto {
    return {
      id: params.id,
    };
  }
}

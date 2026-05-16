import type { ReadEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/read-email-template.input.dto';
import type { ReadEmailTemplateParamsDto } from '@src/modules/email-template/adapters/http/dto/request/read-email-template.params.dto';

export class ReadEmailTemplateRequestMapper {
  static toInput(
    params: ReadEmailTemplateParamsDto,
  ): ReadEmailTemplateInputDto {
    return {
      slug: params.slug,
    };
  }
}

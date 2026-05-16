import type { UpdateEmailTemplateInputDto } from '@src/modules/email-template/application/dto/input/update-email-template.input.dto';
import type { UpdateEmailTemplateParamsDto } from '@src/modules/email-template/adapters/http/dto/request/update-email-template.params.dto';
import type { UpdateEmailTemplateRequestDto } from '@src/modules/email-template/adapters/http/dto/request/update-email-template.request.dto';

export class UpdateEmailTemplateRequestMapper {
  static toInput(
    params: UpdateEmailTemplateParamsDto,
    body: UpdateEmailTemplateRequestDto,
  ): UpdateEmailTemplateInputDto {
    return {
      slug: params.slug,
      name: body.name,
      description: body.description,
      subject: body.subject,
      preheader: body.preheader,
      body: body.body,
      isActive: body.isActive,
      category: body.category,
    };
  }
}

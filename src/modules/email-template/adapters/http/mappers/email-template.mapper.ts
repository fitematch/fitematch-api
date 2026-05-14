import type { EmailTemplateResponseDto } from '@src/modules/email-template/adapters/http/dto/response/email-template.response.dto';
import type { EmailTemplateOutputDto } from '@src/modules/email-template/application/dto/output/email-template.output.dto';

export class EmailTemplateMapper {
  static toResponse(output: EmailTemplateOutputDto): EmailTemplateResponseDto {
    return {
      id: output.id,
      slug: output.slug,
      name: output.name,
      description: output.description,
      subject: output.subject,
      preheader: output.preheader,
      body: output.body,
      defaultSubject: output.defaultSubject,
      defaultPreheader: output.defaultPreheader,
      defaultBody: output.defaultBody,
      variables: output.variables,
      isSystem: output.isSystem,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  static toResponseList(
    output: EmailTemplateOutputDto[],
  ): EmailTemplateResponseDto[] {
    return output.map((template) => this.toResponse(template));
  }
}

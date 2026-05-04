import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import type { UpdateMyCompanyRequestDto } from '@src/modules/company/adapters/http/dto/request/update-my-company.request.dto';
import { UpdateMyCompanyInputDto } from '@src/modules/company/application/dto/input/update-my-company.input.dto';

export class UpdateMyCompanyRequestMapper {
  static toInput(
    user: AuthUserPayload,
    body: UpdateMyCompanyRequestDto,
  ): UpdateMyCompanyInputDto {
    return {
      userId: user.id,
      slug: body.slug,
      tradeName: body.tradeName,
      legalName: body.legalName,
      contacts: body.contacts,
      documents: body.documents,
      media: body.media,
    };
  }
}

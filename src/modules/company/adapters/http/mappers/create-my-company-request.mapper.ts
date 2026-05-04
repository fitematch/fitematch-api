import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import type { CreateMyCompanyRequestDto } from '@src/modules/company/adapters/http/dto/request/create-my-company.request.dto';
import { CreateMyCompanyInputDto } from '@src/modules/company/application/dto/input/create-my-company.input.dto';

export class CreateMyCompanyRequestMapper {
  static toInput(
    user: AuthUserPayload,
    body: CreateMyCompanyRequestDto,
  ): CreateMyCompanyInputDto {
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

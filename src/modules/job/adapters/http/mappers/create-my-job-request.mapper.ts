import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import type { CreateMyJobRequestDto } from '@src/modules/job/adapters/http/dto/request/create-my-job.request.dto';
import type { CreateMyJobInputDto } from '@src/modules/job/application/dto/input/create-my-job.input.dto';

export class CreateMyJobRequestMapper {
  static toInput(
    user: AuthUserPayload,
    body: CreateMyJobRequestDto,
  ): CreateMyJobInputDto {
    return {
      userId: user.id,
      companyId: body.companyId,
      slug: body.slug,
      title: body.title,
      description: body.description,
      slots: body.slots,
      requirements: body.requirements,
      benefits: body.benefits,
      media: body.media,
      contractType: body.contractType,
      status: body.status,
    };
  }
}

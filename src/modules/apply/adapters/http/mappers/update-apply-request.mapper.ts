import type { UpdateApplyInputDto } from '@src/modules/apply/application/dto/input/update-apply.input.dto';
import type { UpdateApplyParamsDto } from '@src/modules/apply/adapters/http/dto/request/update-apply.params.dto';
import type { UpdateApplyRequestDto } from '@src/modules/apply/adapters/http/dto/request/update-apply.request.dto';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';

export class UpdateApplyRequestMapper {
  static toInput(
    params: UpdateApplyParamsDto,
    body: UpdateApplyRequestDto,
    user: AuthUserPayload,
  ): UpdateApplyInputDto {
    return {
      _id: params.applyId,
      status: body.status,
      productRole: user.productRole,
      recruiterCompanyId: user.recruiterProfile?.companyId,
    };
  }
}

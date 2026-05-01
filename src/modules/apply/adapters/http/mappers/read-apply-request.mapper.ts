import type { ReadApplyInputDto } from '@src/modules/apply/application/dto/input/read-apply.input.dto';
import type { ReadApplyParamsDto } from '@src/modules/apply/adapters/http/dto/request/read-apply.params.dto';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';

export class ReadApplyRequestMapper {
  static toInput(
    params: ReadApplyParamsDto,
    user: AuthUserPayload,
  ): ReadApplyInputDto {
    return {
      _id: params.applyId,
      userId: user.id,
      productRole: user.productRole,
      recruiterCompanyId: user.recruiterProfile?.companyId,
    };
  }
}

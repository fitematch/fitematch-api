import type { DeleteApplyInputDto } from '@src/modules/apply/application/dto/input/delete-apply.input.dto';
import type { DeleteApplyParamsDto } from '@src/modules/apply/adapters/http/dto/request/delete-apply.params.dto';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';

export class DeleteApplyRequestMapper {
  static toInput(
    params: DeleteApplyParamsDto,
    user: AuthUserPayload,
  ): DeleteApplyInputDto {
    return {
      _id: params.applyId,
      userId: user.id,
      productRole: user.productRole,
    };
  }
}

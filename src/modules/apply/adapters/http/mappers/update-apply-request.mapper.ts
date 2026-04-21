import type { UpdateApplyInputDto } from '@src/modules/apply/application/dto/input/update-apply.input.dto';
import type { UpdateApplyParamsDto } from '@src/modules/apply/adapters/http/dto/request/update-apply.params.dto';
import type { UpdateApplyRequestDto } from '@src/modules/apply/adapters/http/dto/request/update-apply.request.dto';

export class UpdateApplyRequestMapper {
  static toInput(
    params: UpdateApplyParamsDto,
    body: UpdateApplyRequestDto,
  ): UpdateApplyInputDto {
    return {
      _id: params._id,
      status: body.status,
    };
  }
}

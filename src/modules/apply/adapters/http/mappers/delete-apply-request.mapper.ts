import type { DeleteApplyInputDto } from '@src/modules/apply/application/dto/input/delete-apply.input.dto';
import type { DeleteApplyParamsDto } from '@src/modules/apply/adapters/http/dto/request/delete-apply.params.dto';

export class DeleteApplyRequestMapper {
  static toInput(params: DeleteApplyParamsDto): DeleteApplyInputDto {
    return {
      _id: params.applyId,
    };
  }
}

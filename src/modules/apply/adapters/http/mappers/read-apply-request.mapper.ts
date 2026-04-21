import type { ReadApplyInputDto } from '@src/modules/apply/application/dto/input/read-apply.input.dto';
import type { ReadApplyParamsDto } from '@src/modules/apply/adapters/http/dto/request/read-apply.params.dto';

export class ReadApplyRequestMapper {
  static toInput(params: ReadApplyParamsDto): ReadApplyInputDto {
    return {
      _id: params._id,
    };
  }
}

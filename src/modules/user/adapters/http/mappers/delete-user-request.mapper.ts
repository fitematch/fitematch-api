import type { DeleteUserInputDto } from '@src/modules/user/application/dto/input/delete-user.input.dto';
import type { DeleteUserParamsDto } from '@src/modules/user/adapters/http/dto/request/delete-user.params.dto';

export class DeleteUserRequestMapper {
  static toInput(params: DeleteUserParamsDto): DeleteUserInputDto {
    return {
      id: params.id,
    };
  }
}

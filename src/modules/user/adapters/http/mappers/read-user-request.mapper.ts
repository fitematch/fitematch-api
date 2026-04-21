import type { ReadUserInputDto } from '@src/modules/user/application/dto/input/read-user.input.dto';
import type { ReadUserParamsDto } from '@src/modules/user/adapters/http/dto/request/read-user.params.dto';

export class ReadUserRequestMapper {
  static toInput(params: ReadUserParamsDto): ReadUserInputDto {
    return {
      _id: params._id,
    };
  }
}

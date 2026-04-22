import type { UpdateMeInputDto } from '@src/modules/auth/application/dto/input/update-me.input.dto';
import type { UpdateMeRequestDto } from '@src/modules/auth/adapters/http/dto/request/update-me.request.dto';
import type { JwtPayloadType } from '@src/modules/auth/domain/types/jwt-payload.type';

export class UpdateMeRequestMapper {
  public static toInput(
    user: JwtPayloadType,
    body: UpdateMeRequestDto,
  ): UpdateMeInputDto {
    return {
      userId: user.sub,
      name: body.name,
      birthday: body.birthday,
    };
  }
}

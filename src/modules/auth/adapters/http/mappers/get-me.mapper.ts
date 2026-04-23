import type { GetMeOutputDto } from '@src/modules/auth/application/dto/output/get-me.output.dto';
import type { GetMeResponseDto } from '@src/modules/auth/adapters/http/dto/response/get-me.response.dto';
import { UpdateMeMapper } from '@src/modules/auth/adapters/http/mappers/update-me.mapper';

export class GetMeMapper {
  public static toResponse(user: GetMeOutputDto): GetMeResponseDto {
    return UpdateMeMapper.toResponse(user);
  }
}

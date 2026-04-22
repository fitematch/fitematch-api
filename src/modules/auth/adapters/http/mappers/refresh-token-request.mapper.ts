import type { RefreshTokenInputDto } from '@src/modules/auth/application/dto/input/refresh-token.input.dto';
import type { RefreshTokenRequestDto } from '@src/modules/auth/adapters/http/dto/request/refresh-token.request.dto';

export class RefreshTokenRequestMapper {
  public static toInput(body: RefreshTokenRequestDto): RefreshTokenInputDto {
    return {
      refreshToken: body.refreshToken,
    };
  }
}

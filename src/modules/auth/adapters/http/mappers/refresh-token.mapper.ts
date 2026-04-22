import type { RefreshTokenOutputDto } from '@src/modules/auth/application/dto/output/refresh-token.output.dto';
import type { RefreshTokenResponseDto } from '@src/modules/auth/adapters/http/dto/response/refresh-token.response.dto';

export class RefreshTokenMapper {
  public static toResponse(
    result: RefreshTokenOutputDto,
  ): RefreshTokenResponseDto {
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }
}

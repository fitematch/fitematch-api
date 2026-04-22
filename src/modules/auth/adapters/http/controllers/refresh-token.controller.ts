import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { REFRESH_TOKEN_USE_CASE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { RefreshTokenUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/refresh-token.use-case.interface';
import { RefreshTokenRequestDto } from '@src/modules/auth/adapters/http/dto/request/refresh-token.request.dto';
import { RefreshTokenResponseDto } from '@src/modules/auth/adapters/http/dto/response/refresh-token.response.dto';
import { RefreshTokenRequestMapper } from '@src/modules/auth/adapters/http/mappers/refresh-token-request.mapper';
import { RefreshTokenMapper } from '@src/modules/auth/adapters/http/mappers/refresh-token.mapper';

@ApiTags('Auth')
@Controller('auth')
export class RefreshTokenController {
  constructor(
    @Inject(REFRESH_TOKEN_USE_CASE)
    private readonly refreshTokenUseCase: RefreshTokenUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Refresh token',
    description: 'Generates new access and refresh tokens.',
  })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully.',
    type: RefreshTokenResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token.',
  })
  @Post('refresh')
  public async handle(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    const result = await this.refreshTokenUseCase.execute(
      RefreshTokenRequestMapper.toInput(body),
    );

    return RefreshTokenMapper.toResponse(result);
  }
}

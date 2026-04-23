import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  HASH_SERVICE,
  REFRESH_TOKEN_REPOSITORY,
  SESSION_REPOSITORY,
  TOKEN_SERVICE,
} from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { RefreshTokenUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/refresh-token.use-case.interface';
import type { RefreshTokenRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/refresh-token.repository.interface';
import type { SessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/session.repository.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';
import type { TokenServiceInterface } from '@src/modules/auth/application/contracts/services/token.service.interface';
import { RefreshTokenInputDto } from '@src/modules/auth/application/dto/input/refresh-token.input.dto';
import { RefreshTokenOutputDto } from '@src/modules/auth/application/dto/output/refresh-token.output.dto';

@Injectable()
export class RefreshTokenUseCase implements RefreshTokenUseCaseInterface {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryInterface,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepositoryInterface,
    @Inject(HASH_SERVICE)
    private readonly hashService: HashServiceInterface,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServiceInterface,
  ) {}

  public async execute(
    input: RefreshTokenInputDto,
  ): Promise<RefreshTokenOutputDto> {
    let payload: { sub: string; email: string };

    try {
      payload = await this.tokenService.verifyRefreshToken(input.refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const session = await this.sessionRepository.findValidByUserId(payload.sub);

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const refreshTokenMatches = await this.hashService.compare(
      input.refreshToken,
      session.refreshTokenHash,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const user = await this.refreshTokenRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    await this.sessionRepository.revokeById(session.id);

    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      productRole: user.productRole,
      adminRole: user.adminRole,
      permissions: user.permissions,
    });

    const refreshToken = await this.tokenService.generateRefreshToken({
      sub: user.id,
      email: user.email,
    });

    const refreshTokenHash = await this.hashService.hash(refreshToken);

    await this.sessionRepository.create({
      userId: user.id,
      refreshTokenHash,
      expiresAt: this.tokenService.getRefreshTokenExpiresAt(),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

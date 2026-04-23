import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  HASH_SERVICE,
  SESSION_REPOSITORY,
  TOKEN_SERVICE,
} from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { SessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/session.repository.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';
import type { TokenServiceInterface } from '@src/modules/auth/application/contracts/services/token.service.interface';
import type { SignOutUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-out.use-case.interface';
import type { SignOutInputDto } from '@src/modules/auth/application/dto/input/sign-out.input.dto';
import type { SignOutOutputDto } from '@src/modules/auth/application/dto/output/sign-out.output.dto';

@Injectable()
export class SignOutUseCase implements SignOutUseCaseInterface {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepositoryInterface,
    @Inject(HASH_SERVICE)
    private readonly hashService: HashServiceInterface,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServiceInterface,
  ) {}

  public async execute(input: SignOutInputDto): Promise<SignOutOutputDto> {
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

    await this.sessionRepository.revokeById(session.id);

    return {
      message: 'Signed out successfully.',
    };
  }
}

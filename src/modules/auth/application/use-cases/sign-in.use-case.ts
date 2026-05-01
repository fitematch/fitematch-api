import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  HASH_SERVICE,
  SESSION_REPOSITORY,
  SIGN_IN_REPOSITORY,
  TOKEN_SERVICE,
} from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { SignInUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-in.use-case.interface';
import type { SignInRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/sign-in.repository.interface';
import type { SessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/session.repository.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';
import type {
  AccessTokenPayload,
  TokenServiceInterface,
} from '@src/modules/auth/application/contracts/services/token.service.interface';
import { SignInInputDto } from '@src/modules/auth/application/dto/input/sign-in.input.dto';
import { SignInOutputDto } from '@src/modules/auth/application/dto/output/sign-in.output.dto';

@Injectable()
export class SignInUseCase implements SignInUseCaseInterface {
  constructor(
    @Inject(SIGN_IN_REPOSITORY)
    private readonly signInRepository: SignInRepositoryInterface,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepositoryInterface,
    @Inject(HASH_SERVICE)
    private readonly hashService: HashServiceInterface,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServiceInterface,
  ) {}

  public async execute(input: SignInInputDto): Promise<SignInOutputDto> {
    const user = await this.signInRepository.findByEmail(input.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await this.hashService.compare(
      input.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      productRole: user.productRole,
      adminRole: user.adminRole,
      recruiterProfile: user.recruiterProfile
        ? {
            companyId: user.recruiterProfile.companyId,
            position: user.recruiterProfile.position,
          }
        : undefined,
      permissions: user.permissions,
    };

    const accessToken =
      await this.tokenService.generateAccessToken(accessPayload);

    const refreshToken = await this.tokenService.generateRefreshToken({
      sub: user.id,
      email: user.email,
    });

    const refreshTokenHash = await this.hashService.hash(refreshToken);

    await this.sessionRepository.create({
      userId: user.id,
      refreshTokenHash,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
      expiresAt: this.tokenService.getRefreshTokenExpiresAt(),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        productRole: user.productRole,
        adminRole: user.adminRole,
        permissions: user.permissions,
        status: user.status,
      },
    };
  }
}

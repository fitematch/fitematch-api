import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenServiceInterface,
} from '@src/modules/auth/application/contracts/services/token.service.interface';

@Injectable()
export class JwtTokenService implements TokenServiceInterface {
  constructor(private readonly jwtService: JwtService) {}

  public async generateAccessToken(
    payload: AccessTokenPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET ?? 'default_jwt_secret',
      expiresIn: '1d',
    });
  }

  public async generateRefreshToken(
    payload: RefreshTokenPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'default_jwt_refresh_secret',
      expiresIn: '7d',
    });
  }

  public async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'default_jwt_refresh_secret',
    });
  }
}

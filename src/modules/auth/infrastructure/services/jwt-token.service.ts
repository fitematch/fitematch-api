import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenServiceInterface,
} from '@src/modules/auth/application/contracts/services/token.service.interface';

@Injectable()
export class JwtTokenService implements TokenServiceInterface {
  constructor(private readonly jwtService: JwtService) {}

  private getAccessTokenExpiresIn(): StringValue {
    return (process.env.JWT_EXPIRES_IN ?? '1d') as StringValue;
  }

  private getRefreshTokenExpiresIn(): StringValue {
    return (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as StringValue;
  }

  public async generateAccessToken(
    payload: AccessTokenPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET ?? 'default_jwt_secret',
      expiresIn: this.getAccessTokenExpiresIn(),
    });
  }

  public async generateRefreshToken(
    payload: RefreshTokenPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'default_jwt_refresh_secret',
      expiresIn: this.getRefreshTokenExpiresIn(),
    });
  }

  public async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'default_jwt_refresh_secret',
    });
  }

  public getRefreshTokenExpiresAt(): Date {
    const expiresIn = this.getRefreshTokenExpiresIn();

    if (expiresIn.endsWith('d')) {
      const days = Number(expiresIn.replace('d', ''));
      return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
}

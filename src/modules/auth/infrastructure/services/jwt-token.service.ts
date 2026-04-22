import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type {
  AccessTokenPayload,
  TokenServiceInterface,
} from '@src/modules/auth/application/contracts/services/token.service.interface';

@Injectable()
export class JwtTokenService implements TokenServiceInterface {
  constructor(private readonly jwtService: JwtService) {}

  public async generateAccessToken(
    payload: AccessTokenPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}

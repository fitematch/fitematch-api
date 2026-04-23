export interface AccessTokenPayload {
  sub: string;
  email: string;
  productRole?: string;
  adminRole?: string;
  permissions?: string[];
}

export interface RefreshTokenPayload {
  sub: string;
  email: string;
}

export interface TokenServiceInterface {
  generateAccessToken(payload: AccessTokenPayload): Promise<string>;
  generateRefreshToken(payload: RefreshTokenPayload): Promise<string>;
  verifyRefreshToken(token: string): Promise<RefreshTokenPayload>;
  getRefreshTokenExpiresAt(): Date;
}

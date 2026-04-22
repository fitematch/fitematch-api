export interface AccessTokenPayload {
  sub: string;
  email: string;
  productRole?: string;
  adminRole?: string;
  permissions?: string[];
}

export interface TokenServiceInterface {
  generateAccessToken(payload: AccessTokenPayload): Promise<string>;
}

export interface SignOutRepositoryInterface {
  revokeByRefreshTokenHash(
    userId: string,
    refreshTokenHash: string,
  ): Promise<void>;
}

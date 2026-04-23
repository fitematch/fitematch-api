export interface SessionEntity {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

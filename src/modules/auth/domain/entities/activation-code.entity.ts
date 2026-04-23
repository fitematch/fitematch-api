import { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';

export interface ActivationCodeEntity {
  id: string;
  userId: string;
  codeHash: string;
  type: ActivationCodeTypeEnum;
  expiresAt: Date;
  usedAt?: Date;
  attemptsCount: number;
  maxAttempts: number;
  createdAt?: Date;
  updatedAt?: Date;
}

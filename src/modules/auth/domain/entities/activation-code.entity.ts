import { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';

export interface ActivationCodeEntity {
  id: string;
  userId: string;
  code: string;
  type: ActivationCodeTypeEnum;
  expiresAt: Date;
  usedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

import type { ActivationCodeEntity } from '@src/modules/auth/domain/entities/activation-code.entity';
import type { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';

export interface ActivationCodeRepositoryInterface {
  create(
    input: Omit<ActivationCodeEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ActivationCodeEntity>;
  invalidateActiveCodes(
    userId: string,
    type: ActivationCodeTypeEnum,
  ): Promise<void>;
}

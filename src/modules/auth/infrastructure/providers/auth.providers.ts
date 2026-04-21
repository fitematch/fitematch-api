import type { Provider } from '@nestjs/common';
import {
  ACTIVATION_CODE_REPOSITORY,
  HASH_SERVICE,
  SIGN_UP_REPOSITORY,
  SIGN_UP_USE_CASE,
} from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import { SignUpUseCase } from '@src/modules/auth/application/use-cases/sign-up.use-case';
import { SignUpRepository } from '@src/modules/auth/infrastructure/repositories/sign-up.repository';
import { ActivationCodeRepository } from '@src/modules/auth/infrastructure/repositories/activation-code.repository';
import { PasswordHashService } from '@src/modules/auth/infrastructure/services/password-hash.service';

export const authProviders: Provider[] = [
  {
    provide: SIGN_UP_USE_CASE,
    useClass: SignUpUseCase,
  },
  {
    provide: SIGN_UP_REPOSITORY,
    useClass: SignUpRepository,
  },
  {
    provide: ACTIVATION_CODE_REPOSITORY,
    useClass: ActivationCodeRepository,
  },
  {
    provide: HASH_SERVICE,
    useClass: PasswordHashService,
  },
];

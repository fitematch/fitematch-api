import type { Provider } from '@nestjs/common';
import {
  SIGN_UP_REPOSITORY,
  SIGN_UP_USE_CASE,
  CREATE_ACTIVATION_CODE_REPOSITORY,
  CREATE_ACTIVATION_CODE_USE_CASE,
  ACTIVATE_ACCOUNT_REPOSITORY,
  ACTIVATE_ACCOUNT_USE_CASE,
  ACTIVATION_CODE_REPOSITORY,
  HASH_SERVICE,
  SIGN_IN_REPOSITORY,
  SIGN_IN_USE_CASE,
  GET_ME_REPOSITORY,
  GET_ME_USE_CASE,
  UPDATE_ME_REPOSITORY,
  UPDATE_ME_USE_CASE,
  REFRESH_TOKEN_REPOSITORY,
  REFRESH_TOKEN_USE_CASE,
  TOKEN_SERVICE,
} from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import { SignUpUseCase } from '@src/modules/auth/application/use-cases/sign-up.use-case';
import { SignUpRepository } from '@src/modules/auth/infrastructure/repositories/sign-up.repository';
import { CreateActivationCodeUseCase } from '@src/modules/auth/application/use-cases/create-activation-code.use-case';
import { CreateActivationCodeRepository } from '@src/modules/auth/infrastructure/repositories/create-activation-code.repository';
import { ActivateAccountUseCase } from '@src/modules/auth/application/use-cases/activate-account.use-case';
import { ActivateAccountRepository } from '@src/modules/auth/infrastructure/repositories/activate-account.repository';
import { ActivationCodeRepository } from '@src/modules/auth/infrastructure/repositories/activation-code.repository';
import { SignInUseCase } from '@src/modules/auth/application/use-cases/sign-in.use-case';
import { SignInRepository } from '@src/modules/auth/infrastructure/repositories/sign-in.repository';
import { GetMeUseCase } from '@src/modules/auth/application/use-cases/get-me.use-case';
import { GetMeRepository } from '@src/modules/auth/infrastructure/repositories/get-me.repository';
import { UpdateMeUseCase } from '@src/modules/auth/application/use-cases/update-me.use-case';
import { UpdateMeRepository } from '@src/modules/auth/infrastructure/repositories/update-me.repository';
import { PasswordHashService } from '@src/modules/auth/infrastructure/services/password-hash.service';
import { RefreshTokenUseCase } from '@src/modules/auth/application/use-cases/refresh-token.use-case';
import { RefreshTokenRepository } from '@src/modules/auth/infrastructure/repositories/refresh-token.repository';
import { JwtTokenService } from '@src/modules/auth/infrastructure/services/jwt-token.service';

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
    provide: CREATE_ACTIVATION_CODE_USE_CASE,
    useClass: CreateActivationCodeUseCase,
  },
  {
    provide: CREATE_ACTIVATION_CODE_REPOSITORY,
    useClass: CreateActivationCodeRepository,
  },
  {
    provide: ACTIVATE_ACCOUNT_USE_CASE,
    useClass: ActivateAccountUseCase,
  },
  {
    provide: ACTIVATE_ACCOUNT_REPOSITORY,
    useClass: ActivateAccountRepository,
  },
  {
    provide: ACTIVATION_CODE_REPOSITORY,
    useClass: ActivationCodeRepository,
  },
  {
    provide: SIGN_IN_USE_CASE,
    useClass: SignInUseCase,
  },
  {
    provide: SIGN_IN_REPOSITORY,
    useClass: SignInRepository,
  },
  {
    provide: GET_ME_USE_CASE,
    useClass: GetMeUseCase,
  },
  {
    provide: GET_ME_REPOSITORY,
    useClass: GetMeRepository,
  },
  {
    provide: UPDATE_ME_USE_CASE,
    useClass: UpdateMeUseCase,
  },
  {
    provide: UPDATE_ME_REPOSITORY,
    useClass: UpdateMeRepository,
  },
  {
    provide: HASH_SERVICE,
    useClass: PasswordHashService,
  },
  {
    provide: REFRESH_TOKEN_USE_CASE,
    useClass: RefreshTokenUseCase,
  },
  {
    provide: REFRESH_TOKEN_REPOSITORY,
    useClass: RefreshTokenRepository,
  },
  {
    provide: TOKEN_SERVICE,
    useClass: JwtTokenService,
  },
];

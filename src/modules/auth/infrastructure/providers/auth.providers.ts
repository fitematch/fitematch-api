import type { Provider } from '@nestjs/common';
import {
  ACTIVATE_ACCOUNT_REPOSITORY,
  ACTIVATE_ACCOUNT_USE_CASE,
  ACTIVATION_CODE_REPOSITORY,
  CREATE_ACTIVATION_CODE_REPOSITORY,
  CREATE_ACTIVATION_CODE_USE_CASE,
  EMAIL_PROVIDER,
  GET_ME_REPOSITORY,
  GET_ME_USE_CASE,
  HASH_SERVICE,
  REFRESH_TOKEN_REPOSITORY,
  REFRESH_TOKEN_USE_CASE,
  SESSION_REPOSITORY,
  SIGN_IN_REPOSITORY,
  SIGN_IN_USE_CASE,
  SIGN_OUT_USE_CASE,
  SIGN_UP_REPOSITORY,
  SIGN_UP_USE_CASE,
  TOKEN_SERVICE,
  UPDATE_ME_REPOSITORY,
  UPDATE_ME_USE_CASE,
  LIST_AUTH_SESSIONS_REPOSITORY,
  LIST_AUTH_SESSIONS_USE_CASE,
  REVOKE_AUTH_SESSION_REPOSITORY,
  REVOKE_AUTH_SESSION_USE_CASE,
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
import { SignOutUseCase } from '@src/modules/auth/application/use-cases/sign-out.use-case';
import { PasswordHashService } from '@src/modules/auth/infrastructure/services/password-hash.service';
import { RefreshTokenUseCase } from '@src/modules/auth/application/use-cases/refresh-token.use-case';
import { RefreshTokenRepository } from '@src/modules/auth/infrastructure/repositories/refresh-token.repository';
import { SessionRepository } from '@src/modules/auth/infrastructure/repositories/session.repository';
import { JwtTokenService } from '@src/modules/auth/infrastructure/services/jwt-token.service';
import { ListAuthSessionsUseCase } from '@src/modules/auth/application/use-cases/list-auth-sessions.use-case';
import { ListAuthSessionsRepository } from '@src/modules/auth/infrastructure/repositories/list-auth-sessions.repository';
import { RevokeAuthSessionUseCase } from '@src/modules/auth/application/use-cases/revoke-auth-session.use-case';
import { RevokeAuthSessionRepository } from '@src/modules/auth/infrastructure/repositories/revoke-auth-session.repository';
import { MailtrapEmailProvider } from '@src/modules/auth/infrastructure/providers/mailtrap-email.provider';

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
    provide: SIGN_OUT_USE_CASE,
    useClass: SignOutUseCase,
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
  {
    provide: SESSION_REPOSITORY,
    useClass: SessionRepository,
  },
  {
    provide: LIST_AUTH_SESSIONS_USE_CASE,
    useClass: ListAuthSessionsUseCase,
  },
  {
    provide: LIST_AUTH_SESSIONS_REPOSITORY,
    useClass: ListAuthSessionsRepository,
  },
  {
    provide: REVOKE_AUTH_SESSION_USE_CASE,
    useClass: RevokeAuthSessionUseCase,
  },
  {
    provide: REVOKE_AUTH_SESSION_REPOSITORY,
    useClass: RevokeAuthSessionRepository,
  },
  {
    provide: EMAIL_PROVIDER,
    useClass: MailtrapEmailProvider,
  },
];

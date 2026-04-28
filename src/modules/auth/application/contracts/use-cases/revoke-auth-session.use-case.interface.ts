import { RevokeAuthSessionInput } from '@src/modules/auth/application/dto/input/revoke-auth-session.input';

export interface RevokeAuthSessionUseCaseInterface {
  execute(input: RevokeAuthSessionInput): Promise<void>;
}

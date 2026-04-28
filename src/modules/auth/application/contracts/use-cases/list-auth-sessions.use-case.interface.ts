import { ListAuthSessionsInput } from '@src/modules/auth/application/dto/input/list-auth-sessions.input';
import { ListAuthSessionsOutput } from '@src/modules/auth/application/dto/output/list-auth-sessions.output';

export interface ListAuthSessionsUseCaseInterface {
  execute(input: ListAuthSessionsInput): Promise<ListAuthSessionsOutput[]>;
}

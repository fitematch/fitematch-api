import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { REVOKE_AUTH_SESSION_REPOSITORY } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { RevokeAuthSessionRepository } from '@src/modules/auth/application/contracts/repositories/revoke-auth-session.repository';
import type { RevokeAuthSessionInput } from '@src/modules/auth/application/dto/input/revoke-auth-session.input';
import type { RevokeAuthSessionUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/revoke-auth-session.use-case.interface';

@Injectable()
export class RevokeAuthSessionUseCase implements RevokeAuthSessionUseCaseInterface {
  constructor(
    @Inject(REVOKE_AUTH_SESSION_REPOSITORY)
    private readonly repository: RevokeAuthSessionRepository,
  ) {}

  async execute(input: RevokeAuthSessionInput): Promise<void> {
    const session = await this.repository.findById(input.sessionId);

    if (!session) {
      throw new NotFoundException('Session not found.');
    }

    if (session.userId !== input.userId) {
      throw new ForbiddenException(
        'You are not allowed to revoke this session.',
      );
    }

    await this.repository.revokeById(input.sessionId);
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { LIST_AUTH_SESSIONS_REPOSITORY } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { ListAuthSessionsRepository } from '@src/modules/auth/application/contracts/repositories/list-auth-sessions.repository';
import type { ListAuthSessionsInput } from '@src/modules/auth/application/dto/input/list-auth-sessions.input';
import type { ListAuthSessionsOutput } from '@src/modules/auth/application/dto/output/list-auth-sessions.output';
import type { ListAuthSessionsUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/list-auth-sessions.use-case.interface';

@Injectable()
export class ListAuthSessionsUseCase implements ListAuthSessionsUseCaseInterface {
  constructor(
    @Inject(LIST_AUTH_SESSIONS_REPOSITORY)
    private readonly repository: ListAuthSessionsRepository,
  ) {}

  async execute(
    input: ListAuthSessionsInput,
  ): Promise<ListAuthSessionsOutput[]> {
    const sessions = await this.repository.findByUserId(input.userId);

    return sessions.map((session) => ({
      id: session.id,
      userId: session.userId,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));
  }
}

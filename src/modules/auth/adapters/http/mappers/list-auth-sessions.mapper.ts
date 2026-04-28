import { ListAuthSessionsOutput } from '@src/modules/auth/application/dto/output/list-auth-sessions.output';
import { ListAuthSessionsResponseDto } from '@src/modules/auth/adapters/http/dto/response/list-auth-sessions-response.dto';

export class ListAuthSessionsMapper {
  static toResponse(
    output: ListAuthSessionsOutput,
  ): ListAuthSessionsResponseDto {
    return {
      id: output.id,
      userId: output.userId,
      userAgent: output.userAgent,
      ipAddress: output.ipAddress,
      expiresAt: output.expiresAt,
      revokedAt: output.revokedAt,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  static toResponseList(
    output: ListAuthSessionsOutput[],
  ): ListAuthSessionsResponseDto[] {
    return output.map((item) => this.toResponse(item));
  }
}

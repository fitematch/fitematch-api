import type { SignInOutputDto } from '@src/modules/auth/application/dto/output/sign-in.output.dto';
import type { SignInResponseDto } from '@src/modules/auth/adapters/http/dto/response/sign-in.response.dto';

export class SignInMapper {
  public static toResponse(result: SignInOutputDto): SignInResponseDto {
    return {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        productRole: result.user.productRole,
        adminRole: result.user.adminRole,
        permissions: result.user.permissions,
        status: result.user.status,
      },
    };
  }
}

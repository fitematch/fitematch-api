import type { SignUpOutputDto } from '@src/modules/auth/application/dto/output/sign-up.output.dto';
import type { SignUpResponseDto } from '@src/modules/auth/adapters/http/dto/response/sign-up.response.dto';

export class SignUpMapper {
  public static toResponse(user: SignUpOutputDto): SignUpResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      productRole: user.productRole,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

import type { UpdateUserOutputDto } from '@src/modules/user/application/dto/output/update-user.output.dto';
import type { UpdateUserResponseDto } from '@src/modules/user/adapters/http/dto/response/update-user.response.dto';

export class UpdateUserMapper {
  static toResponse(user: UpdateUserOutputDto): UpdateUserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      candidateProfile: user.candidateProfile,
      recruiterProfile: user.recruiterProfile,
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

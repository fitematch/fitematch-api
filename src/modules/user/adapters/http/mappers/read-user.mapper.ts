import type { ReadUserOutputDto } from '@src/modules/user/application/dto/output/read-user.output.dto';
import type { ReadUserResponseDto } from '@src/modules/user/adapters/http/dto/response/read-user.response.dto';

export class ReadUserMapper {
  static toResponse(user: ReadUserOutputDto): ReadUserResponseDto {
    return {
      _id: user._id,
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

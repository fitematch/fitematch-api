import { CreateUserOutputDto } from '@src/modules/user/application/dto/output/create-user.output.dto';
import { CreateUserResponseDto } from '@src/modules/user/adapters/http/dto/response/create-user.response.dto';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

export class CreateUserMapper {
  static toResponse(user: CreateUserOutputDto): CreateUserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      candidateProfile: user.candidateProfile,
      recruiterProfile: user.recruiterProfile,
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status ?? UserStatusEnum.PENDING,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

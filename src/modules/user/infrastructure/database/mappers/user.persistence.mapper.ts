import { ListUserRepositoryOutputDto } from '@src/modules/user/application/dto/output/list-user.repository-output.dto';
import { LeanUser } from '@src/modules/user/infrastructure/database/types/user-lean.type';

export class UserPersistenceMapper {
  static toListOutput(this: void, user: LeanUser): ListUserRepositoryOutputDto {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().split('T')[0]
        : undefined,
      candidateProfile: user.candidateProfile,
      recruiterProfile: user.recruiterProfile,
      status: user.status,
      productRole: user.productRole,
      adminRole: user.adminRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

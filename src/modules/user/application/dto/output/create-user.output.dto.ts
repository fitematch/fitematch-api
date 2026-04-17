import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import {
  CandidateDocumentsEntity,
  ContactInfoEntity,
  CandidateMediaEntity,
} from '@src/modules/user/domain/entities/user.entity';

export class CreateUserOutputDto {
  id!: string;
  name!: string;
  email!: string;
  birthday?: string;
  documents?: CandidateDocumentsEntity;
  contacts?: ContactInfoEntity;
  media?: CandidateMediaEntity;
  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  status?: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

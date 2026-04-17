import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import {
  CandidateDocumentsEntity,
  ContactInfoEntity,
  CandidateMediaEntity,
} from '@src/modules/user/domain/entities/user.entity';

export class UpdateUserInputDto {
  id!: string;
  name?: string;
  email?: string;
  password?: string;
  birthday?: string;
  documents?: CandidateDocumentsEntity;
  contacts?: ContactInfoEntity;
  media?: CandidateMediaEntity;
  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  status?: UserStatusEnum;
}

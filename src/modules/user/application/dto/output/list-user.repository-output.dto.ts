import {
  DocumentsEntity,
  PhoneEntity,
  AddressEntity,
  SocialEntity,
  MediaEntity,
} from '@src/modules/user/domain/entities/user.entity';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

export class ListUserRepositoryOutputDto {
  id?: string;
  name?: string;
  email?: string;
  birthday?: string;
  document?: DocumentsEntity;
  phone?: PhoneEntity;
  address?: AddressEntity;
  social?: SocialEntity;
  media?: MediaEntity;
  status?: UserStatusEnum;
  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

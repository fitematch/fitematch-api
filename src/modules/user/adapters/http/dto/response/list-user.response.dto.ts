import {
  DocumentsEntity,
  AddressEntity,
  PhoneEntity,
  SocialEntity,
  MediaEntity,
} from '@src/modules/user/domain/entities/user.entity';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

export class ListUserResponseDto {
  id?: string;
  name?: string;
  email?: string;
  birthday?: string;
  document?: DocumentsEntity;
  phone?: PhoneEntity;
  address?: AddressEntity;
  social?: SocialEntity;
  media?: MediaEntity;
  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  status?: UserStatusEnum;
}

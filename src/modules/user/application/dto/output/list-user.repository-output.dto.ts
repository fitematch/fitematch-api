import {
  DocumentsEntity,
  PhoneEntity,
  AddressEntity,
  SocialEntity,
  MediaEntity,
} from '@src/modules/user/domain/entities/user.entity';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

export class ListUserRepositoryOutputDto {
  id?: string;
  name?: string;
  email?: string;
  document?: DocumentsEntity;
  phone?: PhoneEntity;
  address?: AddressEntity;
  social?: SocialEntity;
  media?: MediaEntity;
  status?: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

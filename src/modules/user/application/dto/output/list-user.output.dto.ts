import {
  DocumentsEntity,
  AddressEntity,
  PhoneEntity,
  SocialEntity,
  MediaEntity,
} from '@src/modules/user/domain/entities/user.entity';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

export class ListUserOutputDto {
  id?: string;
  name?: string;
  email?: string;
  document?: DocumentsEntity;
  phone?: PhoneEntity;
  address?: AddressEntity;
  social?: SocialEntity;
  media?: MediaEntity;
  status?: UserStatusEnum;
}

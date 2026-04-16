import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

export interface DocumentsEntity {
  identityDocumentNumber?: string;
  identityIssuer?: string;
  identityState?: string;
  socialDocumentNumber?: string;
}

export interface PhoneEntity {
  number?: number;
  isWhatsapp?: boolean;
  isTelegram?: boolean;
}

export interface AddressEntity {
  street?: string;
  number?: number;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: number;
}

export interface SocialEntity {
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
}

export interface MidiaEntity {
  resumeUrl?: string;
}

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  documents?: DocumentsEntity;
  phone?: PhoneEntity;
  address?: AddressEntity;
  social?: SocialEntity;
  midia?: MidiaEntity;
  status: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

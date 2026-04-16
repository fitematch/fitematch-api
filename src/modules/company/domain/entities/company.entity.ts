import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

export interface DocumentsEntity {
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
  logoUrl?: string;
}

export interface CompanyEntity {
  id: string;
  slug: string;
  name: string;
  email?: string;
  website?: string;
  documents?: DocumentsEntity;
  phone?: PhoneEntity;
  address?: AddressEntity;
  social?: SocialEntity;
  midia?: MidiaEntity;
  status: CompanyStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

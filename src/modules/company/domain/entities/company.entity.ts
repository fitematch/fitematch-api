import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';
import { CompanyDocumentsEntity } from './company-documents.entity';
import { CompanyMediaEntity } from './company-media.entity';
import { PhoneEntity } from '@src/shared/domain/entities/phone.entity';
import { AddressEntity } from '@src/shared/domain/entities/address.entity';
import { SocialEntity } from '@src/shared/domain/entities/social.entity';

export interface ContactsEntity {
  email: string;
  website?: string;
  phone: PhoneEntity;
  address: AddressEntity;
  social?: SocialEntity;
}

export interface CompanyAuditEntity {
  createdByUserId?: string;
}

export interface CompanyApprovalEntity {
  approvedAt?: Date;
  approvedByUserId?: string;
}

export interface CompanyEntity {
  _id: string;
  slug: string;
  tradeName: string;
  legalName?: string;
  contacts: ContactsEntity;
  documents: CompanyDocumentsEntity;
  media: CompanyMediaEntity;
  audit?: CompanyAuditEntity;
  approval?: CompanyApprovalEntity;
  status: CompanyStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

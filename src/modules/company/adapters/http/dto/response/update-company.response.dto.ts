import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';
import { CompanyDocumentsEntity } from '@src/modules/company/domain/entities/company-documents.entity';
import { CompanyMediaEntity } from '@src/modules/company/domain/entities/company-media.entity';
import { PhoneEntity } from '@src/shared/domain/entities/phone.entity';
import { AddressEntity } from '@src/shared/domain/entities/address.entity';
import { SocialEntity } from '@src/shared/domain/entities/social.entity';

export class UpdateCompanyResponseDto {
  _id!: string;
  slug!: string;
  tradeName!: string;
  legalName?: string;
  contacts!: {
    email: string;
    website?: string;
    phone: PhoneEntity;
    address: AddressEntity;
    social?: SocialEntity;
  };
  documents!: CompanyDocumentsEntity;
  media!: CompanyMediaEntity;
  audit?: {
    createdByUserId?: string;
  };
  approval?: {
    approvedAt?: Date;
    approvedByUserId?: string;
  };
  status!: CompanyStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

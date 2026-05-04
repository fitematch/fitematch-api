import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';
import type { CompanyDocumentsEntity } from '@src/modules/company/domain/entities/company-documents.entity';
import type { CompanyMediaEntity } from '@src/modules/company/domain/entities/company-media.entity';
import { PhoneEntity } from '@src/shared/domain/entities/phone.entity';
import { AddressEntity } from '@src/shared/domain/entities/address.entity';
import { SocialEntity } from '@src/shared/domain/entities/social.entity';

export class ReadMyCompanyResponseDto {
  @ApiProperty()
  _id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  tradeName!: string;

  @ApiPropertyOptional()
  legalName?: string;

  @ApiProperty()
  contacts!: {
    email: string;
    website?: string;
    phone: PhoneEntity;
    address: AddressEntity;
    social?: SocialEntity;
  };

  @ApiProperty({ type: 'object', additionalProperties: true })
  documents!: CompanyDocumentsEntity;

  @ApiProperty({ type: 'object', additionalProperties: true })
  media!: CompanyMediaEntity;

  @ApiPropertyOptional()
  audit?: {
    createdByUserId?: string;
  };

  @ApiPropertyOptional()
  approval?: {
    approvedAt?: Date;
    approvedByUserId?: string;
  };

  @ApiProperty()
  status!: CompanyStatusEnum;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}

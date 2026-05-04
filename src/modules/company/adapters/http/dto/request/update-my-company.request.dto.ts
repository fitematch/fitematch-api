import { ApiPropertyOptional } from '@nestjs/swagger';
import type { CompanyDocumentsEntity } from '@src/modules/company/domain/entities/company-documents.entity';
import type { CompanyMediaEntity } from '@src/modules/company/domain/entities/company-media.entity';
import { PhoneEntity } from '@src/shared/domain/entities/phone.entity';
import { AddressEntity } from '@src/shared/domain/entities/address.entity';
import { SocialEntity } from '@src/shared/domain/entities/social.entity';

export class UpdateMyCompanyRequestDto {
  @ApiPropertyOptional()
  slug?: string;

  @ApiPropertyOptional()
  tradeName?: string;

  @ApiPropertyOptional()
  legalName?: string;

  @ApiPropertyOptional()
  contacts?: {
    email?: string;
    website?: string;
    phone?: PhoneEntity;
    address?: AddressEntity;
    social?: SocialEntity;
  };

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  documents?: CompanyDocumentsEntity;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  media?: CompanyMediaEntity;
}

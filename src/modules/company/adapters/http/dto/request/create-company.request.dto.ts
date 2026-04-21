import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

class PhoneRequestDto {
  @ApiPropertyOptional()
  number?: string;

  @ApiPropertyOptional()
  countryCode?: string;

  @ApiPropertyOptional()
  areaCode?: string;

  @ApiPropertyOptional()
  isWhatsapp?: boolean;

  @ApiPropertyOptional()
  isTelegram?: boolean;
}

class AddressRequestDto {
  @ApiPropertyOptional()
  street?: string;

  @ApiPropertyOptional()
  number?: string | number;

  @ApiPropertyOptional()
  complement?: string;

  @ApiPropertyOptional()
  neighborhood?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  zipCode?: string;
}

class SocialRequestDto {
  @ApiPropertyOptional()
  facebook?: string;

  @ApiPropertyOptional()
  instagram?: string;

  @ApiPropertyOptional()
  x?: string;

  @ApiPropertyOptional()
  linkedin?: string;

  @ApiPropertyOptional()
  youtube?: string;

  @ApiPropertyOptional()
  tiktok?: string;
}

class ContactsRequestDto {
  @ApiProperty()
  email!: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiProperty()
  phone!: PhoneRequestDto;

  @ApiProperty()
  address!: AddressRequestDto;

  @ApiPropertyOptional()
  social?: SocialRequestDto;
}

class AuditRequestDto {
  @ApiPropertyOptional()
  createdByUserId?: string;
}

class ApprovalRequestDto {
  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  approvedByUserId?: string;
}

export class CreateCompanyRequestDto {
  @ApiPropertyOptional()
  slug?: string;

  @ApiProperty()
  tradeName!: string;

  @ApiPropertyOptional()
  legalName?: string;

  @ApiProperty()
  contacts!: ContactsRequestDto;

  @ApiProperty()
  documents!: Record<string, unknown>;

  @ApiProperty()
  media!: Record<string, unknown>;

  @ApiPropertyOptional()
  audit?: AuditRequestDto;

  @ApiPropertyOptional()
  approval?: ApprovalRequestDto;

  @ApiPropertyOptional({ enum: CompanyStatusEnum })
  status?: CompanyStatusEnum;
}

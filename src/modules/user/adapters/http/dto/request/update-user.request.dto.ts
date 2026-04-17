import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

class UpdateUserDocumentRGRequestDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

class UpdateUserDocumentCPFRequestDto {
  @IsOptional()
  @IsString()
  number?: string;
}

class UpdateUserDocumentCREFRequestDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

class UpdateUserDocumentPassportRequestDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}

class UpdateUserDocumentsRequestDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDocumentRGRequestDto)
  rg?: UpdateUserDocumentRGRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDocumentCPFRequestDto)
  cpf?: UpdateUserDocumentCPFRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDocumentCREFRequestDto)
  cref?: UpdateUserDocumentCREFRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDocumentPassportRequestDto)
  passport?: UpdateUserDocumentPassportRequestDto;
}

class UpdateUserPhoneRequestDto {
  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsString()
  areaCode?: string;

  @IsOptional()
  @IsNumber()
  number?: number;

  @IsOptional()
  @IsBoolean()
  isWhatsapp?: boolean;

  @IsOptional()
  @IsBoolean()
  isTelegram?: boolean;
}

class UpdateUserAddressRequestDto {
  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsNumber()
  number?: number;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  zipCode?: number;
}

class UpdateUserSocialRequestDto {
  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  x?: string;

  @IsOptional()
  @IsString()
  youtube?: string;

  @IsOptional()
  @IsString()
  tiktok?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;
}

class UpdateUserMediaRequestDto {
  @IsOptional()
  @IsString()
  resumeUrl?: string;
}

class UpdateUserContactsRequestDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserPhoneRequestDto)
  phone?: UpdateUserPhoneRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserAddressRequestDto)
  address?: UpdateUserAddressRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserSocialRequestDto)
  social?: UpdateUserSocialRequestDto;
}

export class UpdateUserRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserDocumentsRequestDto)
  documents?: UpdateUserDocumentsRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserContactsRequestDto)
  contacts?: UpdateUserContactsRequestDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserMediaRequestDto)
  media?: UpdateUserMediaRequestDto;

  @IsOptional()
  @IsEnum(ProductRoleEnum)
  productRole?: ProductRoleEnum;

  @IsOptional()
  @IsEnum(AdminRoleEnum)
  adminRole?: AdminRoleEnum;

  @IsOptional()
  @IsEnum(UserStatusEnum)
  status?: UserStatusEnum;
}

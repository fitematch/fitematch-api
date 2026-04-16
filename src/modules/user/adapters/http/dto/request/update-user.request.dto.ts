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

class UpdateUserDocumentsRequestDto {
  @IsOptional()
  @IsString()
  identityDocumentNumber?: string;

  @IsOptional()
  @IsString()
  identityIssuer?: string;

  @IsOptional()
  @IsString()
  identityState?: string;

  @IsOptional()
  @IsString()
  socialDocumentNumber?: string;
}

class UpdateUserPhoneRequestDto {
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
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserPhoneRequestDto)
  phone?: UpdateUserPhoneRequestDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserAddressRequestDto)
  address?: UpdateUserAddressRequestDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserSocialRequestDto)
  social?: UpdateUserSocialRequestDto;

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

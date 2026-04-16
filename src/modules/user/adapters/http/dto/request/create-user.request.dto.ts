import {
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
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

class CreateUserDocumentsRequestDto {
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

class CreateUserPhoneRequestDto {
  @IsOptional()
  @IsNumber()
  number?: number;

  @IsOptional()
  isWhatsapp?: boolean;

  @IsOptional()
  isTelegram?: boolean;
}

class CreateUserAddressRequestDto {
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

class CreateUserSocialRequestDto {
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

class CreateUserMediaRequestDto {
  @IsOptional()
  @IsString()
  resumeUrl?: string;
}

export class CreateUserRequestDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDocumentsRequestDto)
  documents?: CreateUserDocumentsRequestDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserPhoneRequestDto)
  phone?: CreateUserPhoneRequestDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserAddressRequestDto)
  address?: CreateUserAddressRequestDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserSocialRequestDto)
  social?: CreateUserSocialRequestDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserMediaRequestDto)
  media?: CreateUserMediaRequestDto;

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

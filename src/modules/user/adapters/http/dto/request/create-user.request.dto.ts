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
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

class CreateUserDocumentRGRequestDto {
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

class CreateUserDocumentCPFRequestDto {
  @IsOptional()
  @IsString()
  number?: string;
}

class CreateUserDocumentCREFRequestDto {
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

class CreateUserDocumentPassportRequestDto {
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

class CreateUserDocumentsRequestDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserDocumentRGRequestDto)
  rg?: CreateUserDocumentRGRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserDocumentCPFRequestDto)
  cpf?: CreateUserDocumentCPFRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserDocumentCREFRequestDto)
  cref?: CreateUserDocumentCREFRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserDocumentPassportRequestDto)
  passport?: CreateUserDocumentPassportRequestDto;
}

class CreateUserPhoneRequestDto {
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

class CreateUserContactsRequestDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserPhoneRequestDto)
  phone?: CreateUserPhoneRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserAddressRequestDto)
  address?: CreateUserAddressRequestDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserSocialRequestDto)
  social?: CreateUserSocialRequestDto;
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
  @ValidateNested()
  @Type(() => CreateUserContactsRequestDto)
  contacts?: CreateUserContactsRequestDto;

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

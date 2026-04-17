import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

export class ReadUserResponseDto {
  id!: string;
  name!: string;
  email!: string;
  birthday?: string;
  documents?: {
    rg?: {
      number: string;
      issuer: string;
      state: string;
    };
    cpf?: {
      number: string;
    };
    cref?: {
      number: string;
      category: string;
      isActive: boolean;
    };
    passport?: {
      number: string;
      country: string;
      expirationDate: string;
    };
  };
  contacts?: {
    phone?: {
      countryCode?: string;
      areaCode?: string;
      number?: number;
      isWhatsapp?: boolean;
      isTelegram?: boolean;
    };
    address?: {
      street?: string;
      number?: number;
      complement?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: number;
    };
    social?: {
      facebook?: string;
      instagram?: string;
      x?: string;
      youtube?: string;
      tiktok?: string;
      linkedin?: string;
    };
  };
  media?: {
    resumeUrl?: string;
  };
  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  status!: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

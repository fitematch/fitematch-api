import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

export type LeanUser = {
  _id: { toString(): string };
  name: string;
  email: string;
  password: string;
  birthday: Date;
  documents?: {
    rg?: {
      number?: string;
      issuer?: string;
      state?: string;
    };
    cpf?: {
      number?: string;
    };
    cref?: {
      number?: string;
      category?: string;
      isActive?: boolean;
    };
    passport?: {
      number?: string;
      country?: string;
      expirationDate?: Date;
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
  status: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
};

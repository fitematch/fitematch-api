import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

export class UpdateUserInputDto {
  id!: string;
  name?: string;
  email?: string;
  password?: string;
  birthday?: string;

  documents?: {
    identityDocumentNumber?: string;
    identityIssuer?: string;
    identityState?: string;
    socialDocumentNumber?: string;
  };

  phone?: {
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

  media?: {
    resumeUrl?: string;
  };

  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  status?: UserStatusEnum;
}

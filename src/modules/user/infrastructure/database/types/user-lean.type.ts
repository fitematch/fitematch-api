import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

export type LeanUser = {
  _id: { toString(): string };
  name: string;
  email: string;
  password: string;
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
  status: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
};

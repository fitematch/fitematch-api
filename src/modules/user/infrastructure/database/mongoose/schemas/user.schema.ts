import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({ _id: false })
class RGSchema {
  @Prop()
  number?: string;

  @Prop()
  issuer?: string;

  @Prop()
  state?: string;
}

@Schema({ _id: false })
class CPFSchema {
  @Prop()
  number?: string;
}

@Schema({ _id: false })
class CREFSchema {
  @Prop()
  number?: string;

  @Prop()
  category?: string;

  @Prop()
  isActive?: boolean;
}

@Schema({ _id: false })
class PassportSchema {
  @Prop()
  number?: string;

  @Prop()
  country?: string;

  @Prop()
  expirationDate?: Date;
}

@Schema({ _id: false })
class DocumentsSchema {
  @Prop({ type: RGSchema })
  rg?: RGSchema;

  @Prop({ type: CPFSchema })
  cpf?: CPFSchema;

  @Prop({ type: CREFSchema })
  cref?: CREFSchema;

  @Prop({ type: PassportSchema })
  passport?: PassportSchema;
}

@Schema({ _id: false })
class PhoneSchema {
  @Prop()
  countryCode?: string;

  @Prop()
  areaCode?: string;

  @Prop()
  number?: number;

  @Prop()
  isWhatsapp?: boolean;

  @Prop()
  isTelegram?: boolean;
}

@Schema({ _id: false })
class AddressSchema {
  @Prop()
  street?: string;

  @Prop()
  number?: number;

  @Prop()
  complement?: string;

  @Prop()
  neighborhood?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  country?: string;

  @Prop()
  zipCode?: number;
}

@Schema({ _id: false })
class SocialSchema {
  @Prop()
  facebook?: string;

  @Prop()
  instagram?: string;

  @Prop()
  x?: string;

  @Prop()
  youtube?: string;

  @Prop()
  tiktok?: string;

  @Prop()
  linkedin?: string;
}

@Schema({ _id: false })
class ContactsSchema {
  @Prop({ type: PhoneSchema })
  phone?: PhoneSchema;

  @Prop({ type: AddressSchema })
  address?: AddressSchema;

  @Prop({ type: SocialSchema })
  social?: SocialSchema;
}

@Schema({ _id: false })
class MediaSchema {
  @Prop()
  resumeUrl?: string;
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserSchema {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  birthday!: Date;

  @Prop({ type: DocumentsSchema })
  documents?: DocumentsSchema;

  @Prop({ type: ContactsSchema })
  contacts?: ContactsSchema;

  @Prop({ type: MediaSchema })
  media?: MediaSchema;

  @Prop({
    enum: Object.values(ProductRoleEnum),
  })
  productRole?: ProductRoleEnum;

  @Prop({
    enum: Object.values(AdminRoleEnum),
  })
  adminRole?: AdminRoleEnum;

  @Prop({
    enum: Object.values(UserStatusEnum),
    default: UserStatusEnum.PENDING,
    required: true,
  })
  status!: UserStatusEnum;
}

export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema);

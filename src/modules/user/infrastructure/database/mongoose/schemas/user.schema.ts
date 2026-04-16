import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({ _id: false })
class DocumentsSchema {
  @Prop()
  identityDocumentNumber?: string;

  @Prop()
  identityIssuer?: string;

  @Prop()
  identityState?: string;

  @Prop()
  socialDocumentNumber?: string;
}

@Schema({ _id: false })
class PhoneSchema {
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

  @Prop({ type: PhoneSchema })
  phone?: PhoneSchema;

  @Prop({ type: AddressSchema })
  address?: AddressSchema;

  @Prop({ type: SocialSchema })
  social?: SocialSchema;

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

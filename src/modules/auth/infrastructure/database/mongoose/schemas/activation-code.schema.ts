import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';

export type ActivationCodeDocument = HydratedDocument<ActivationCodeSchema>;

@Schema({
  collection: 'activation_codes',
  timestamps: true,
})
export class ActivationCodeSchema {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  code!: string;

  @Prop({
    required: true,
    enum: Object.values(ActivationCodeTypeEnum),
  })
  type!: ActivationCodeTypeEnum;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop()
  usedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ActivationCodeSchemaFactory =
  SchemaFactory.createForClass(ActivationCodeSchema);

ActivationCodeSchemaFactory.index({ userId: 1, type: 1, usedAt: 1 });

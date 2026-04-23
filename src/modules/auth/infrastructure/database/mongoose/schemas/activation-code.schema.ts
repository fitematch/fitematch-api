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
  codeHash!: string;

  @Prop({
    required: true,
    enum: Object.values(ActivationCodeTypeEnum),
  })
  type!: ActivationCodeTypeEnum;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop()
  usedAt?: Date;

  @Prop({ required: true, default: 0 })
  attemptsCount!: number;

  @Prop({ required: true, default: 5 })
  maxAttempts!: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ActivationCodeSchemaFactory =
  SchemaFactory.createForClass(ActivationCodeSchema);

ActivationCodeSchemaFactory.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
ActivationCodeSchemaFactory.index({ userId: 1, type: 1, usedAt: 1 });

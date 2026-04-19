import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export type ApplyDocument = HydratedDocument<ApplySchema>;

@Schema({
  collection: 'applies',
  timestamps: true,
})
export class ApplySchema {
  @Prop({ required: true })
  jobId!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({
    required: true,
    enum: Object.values(ApplicationStatusEnum),
  })
  status!: ApplicationStatusEnum;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ApplySchemaFactory = SchemaFactory.createForClass(ApplySchema);

ApplySchemaFactory.index({ jobId: 1, userId: 1 }, { unique: true });

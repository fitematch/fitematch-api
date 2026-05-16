import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SeedDocument = HydratedDocument<SeedSchema>;

@Schema({
  collection: 'system_seeds',
  versionKey: false,
})
export class SeedSchema {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true })
  checksum!: string;

  @Prop({ required: true })
  executedAt!: Date;
}

export const SeedSchemaFactory = SchemaFactory.createForClass(SeedSchema);

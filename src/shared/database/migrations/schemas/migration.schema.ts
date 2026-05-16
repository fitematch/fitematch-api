import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MigrationDocument = HydratedDocument<MigrationSchema>;

@Schema({
  collection: 'system_migrations',
  versionKey: false,
})
export class MigrationSchema {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true })
  batch!: number;

  @Prop({ required: true })
  checksum!: string;

  @Prop({ required: true })
  executedAt!: Date;
}

export const MigrationSchemaFactory =
  SchemaFactory.createForClass(MigrationSchema);

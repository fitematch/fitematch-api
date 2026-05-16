import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LockDocument = HydratedDocument<LockSchema>;

@Schema({
  collection: 'system_locks',
  versionKey: false,
})
export class LockSchema {
  @Prop({ required: true, unique: true })
  key!: string;

  @Prop({ required: true })
  lockedAt!: Date;
}

export const LockSchemaFactory = SchemaFactory.createForClass(LockSchema);

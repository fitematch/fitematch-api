import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<SessionSchema>;

@Schema({
  collection: 'auth_sessions',
  timestamps: true,
})
export class SessionSchema {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  refreshTokenHash!: string;

  @Prop()
  userAgent?: string;

  @Prop()
  ipAddress?: string;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop()
  revokedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const SessionSchemaFactory = SchemaFactory.createForClass(SessionSchema);

SessionSchemaFactory.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
SessionSchemaFactory.index({ userId: 1, revokedAt: 1 });

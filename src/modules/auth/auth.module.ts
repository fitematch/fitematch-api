import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { authProviders } from '@src/modules/auth/infrastructure/providers/auth.providers';
import {
  ActivationCodeSchema,
  ActivationCodeSchemaFactory,
} from '@src/modules/auth/infrastructure/database/mongoose/schemas/activation-code.schema';
import {
  UserSchema,
  UserSchemaFactory,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { SignUpController } from '@src/modules/auth/adapters/http/controllers/sign-up.controller';

const importedControllers = [SignUpController];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ActivationCodeSchema.name,
        schema: ActivationCodeSchemaFactory,
      },
      {
        name: UserSchema.name,
        schema: UserSchemaFactory,
      },
    ]),
  ],
  controllers: [...importedControllers],
  providers: [...authProviders],
  exports: [...authProviders, MongooseModule],
})
export class AuthModule {}

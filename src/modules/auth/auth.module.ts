import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
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
import { SignInController } from '@src/modules/auth/adapters/http/controllers/sign-in.controller';
import { GetMeController } from '@src/modules/auth/adapters/http/controllers/get-me.controller';
import { UpdateMeController } from '@src/modules/auth/adapters/http/controllers/update-me.controller';
import { CreateActivationCodeController } from '@src/modules/auth/adapters/http/controllers/create-activation-code.controller';
import { ActivateAccountController } from '@src/modules/auth/adapters/http/controllers/activate-account.controller';
import { RefreshTokenController } from '@src/modules/auth/adapters/http/controllers/refresh-token.controller';
import { SignOutController } from '@src/modules/auth/adapters/http/controllers/sign-out.controller';
import { JwtStrategy } from '@src/modules/auth/infrastructure/strategies/jwt.strategy';

const importedControllers = [
  SignUpController,
  SignInController,
  GetMeController,
  UpdateMeController,
  CreateActivationCodeController,
  ActivateAccountController,
  RefreshTokenController,
  SignOutController,
];

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'default_jwt_secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
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
  providers: [...authProviders, JwtStrategy],
  exports: [...authProviders, JwtModule, MongooseModule],
})
export class AuthModule {}

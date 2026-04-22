import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

const importedControllers = [SignUpController, SignInController];

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
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
  providers: [...authProviders],
  exports: [...authProviders, MongooseModule],
})
export class AuthModule {}

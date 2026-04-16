import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListUserController } from '@src/modules/user/adapters/http/controllers/list-user.controller';
import { userProviders } from '@src/modules/user/infrastructure/repositories/providers/user.providers';
import {
  UserSchema,
  UserSchemaFactory,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchema.name,
        schema: UserSchemaFactory,
      },
    ]),
  ],
  controllers: [ListUserController],
  providers: [...userProviders],
  exports: [...userProviders, MongooseModule],
})
export class UserModule {}

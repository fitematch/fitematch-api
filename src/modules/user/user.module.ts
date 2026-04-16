import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListUserController } from '@src/modules/user/adapters/http/controllers/list-user.controller';
import { CreateUserController } from '@src/modules/user/adapters/http/controllers/create-user.controller';
import { userProviders } from '@src/modules/user/infrastructure/providers/user.providers';
import {
  UserSchema,
  UserSchemaFactory,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';

const importedControllers = [ListUserController, CreateUserController];
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchema.name,
        schema: UserSchemaFactory,
      },
    ]),
  ],
  controllers: [...importedControllers],
  providers: [...userProviders],
  exports: [...userProviders, MongooseModule],
})
export class UserModule {}

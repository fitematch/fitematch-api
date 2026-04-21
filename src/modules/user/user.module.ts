import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userProviders } from '@src/modules/user/infrastructure/providers/user.providers';
import {
  UserSchema,
  UserSchemaFactory,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { ListUserController } from '@src/modules/user/adapters/http/controllers/list-user.controller';
import { CreateUserController } from '@src/modules/user/adapters/http/controllers/create-user.controller';
import { ReadUserController } from '@src/modules/user/adapters/http/controllers/read-user.controller';
import { UpdateUserController } from '@src/modules/user/adapters/http/controllers/update-user.controller';
import { DeleteUserController } from '@src/modules/user/adapters/http/controllers/delete-user.controller';
import EncryptUtils from '@src/shared/utils/encrypt.utils';

const importedControllers = [
  ListUserController,
  CreateUserController,
  ReadUserController,
  UpdateUserController,
  DeleteUserController,
];
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
  providers: [...userProviders, EncryptUtils],
  exports: [...userProviders, MongooseModule, EncryptUtils],
})
export class UserModule {}

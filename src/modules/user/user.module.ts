import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userProviders } from '@src/modules/user/infrastructure/providers/user.providers';
import {
  UserSchema,
  UserSchemaFactory,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { ListUserController } from '@src/modules/user/adapters/http/controllers/list-user.controller';
import { CreateUserController } from '@src/modules/user/adapters/http/controllers/create-user.controller';
import { ReadUserController } from './adapters/http/controllers/read-user.controller';

const importedControllers = [
  ListUserController,
  CreateUserController,
  ReadUserController,
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
  providers: [...userProviders],
  exports: [...userProviders, MongooseModule],
})
export class UserModule {}

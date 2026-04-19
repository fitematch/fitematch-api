import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { applyProviders } from '@src/modules/apply/infrastructure/providers/apply.providers';
import {
  ApplySchema,
  ApplySchemaFactory,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';
import { ListApplyController } from '@src/modules/apply/adapters/http/controllers/list-apply.controller';
import { CreateApplyController } from '@src/modules/apply/adapters/http/controllers/create-apply.controller';
import { ReadApplyController } from '@src/modules/apply/adapters/http/controllers/read-apply.controller';
import { UpdateApplyController } from '@src/modules/apply/adapters/http/controllers/update-apply.controller';

const importedControllers = [
  ListApplyController,
  CreateApplyController,
  ReadApplyController,
  UpdateApplyController,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ApplySchema.name,
        schema: ApplySchemaFactory,
      },
    ]),
  ],
  controllers: [...importedControllers],
  providers: [...applyProviders],
  exports: [...applyProviders, MongooseModule],
})
export class ApplyModule {}

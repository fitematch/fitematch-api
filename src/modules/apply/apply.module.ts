import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { applyProviders } from '@src/modules/apply/infrastructure/providers/apply.providers';
import {
  ApplySchema,
  ApplySchemaFactory,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';
import { CreateApplyController } from '@src/modules/apply/adapters/http/controllers/create-apply.controller';

const importedControllers = [CreateApplyController];

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

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { applyProviders } from '@src/modules/apply/infrastructure/providers/apply.providers';
import { JobModule } from '@src/modules/job/job.module';
import { UserModule } from '@src/modules/user/user.module';
import {
  ApplySchema,
  ApplySchemaFactory,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';
import { ListApplyController } from '@src/modules/apply/adapters/http/controllers/list-apply.controller';
import { CreateApplyController } from '@src/modules/apply/adapters/http/controllers/create-apply.controller';
import { ReadApplyController } from '@src/modules/apply/adapters/http/controllers/read-apply.controller';
import { UpdateApplyController } from '@src/modules/apply/adapters/http/controllers/update-apply.controller';
import { DeleteApplyController } from '@src/modules/apply/adapters/http/controllers/delete-apply.controller';
import { ListMyAppliesController } from '@src/modules/apply/adapters/http/controllers/list-my-applies.controller';
import { ListAppliesByJobController } from '@src/modules/apply/adapters/http/controllers/list-applies-by-job.controller';

const importedControllers = [
  ListApplyController,
  CreateApplyController,
  ListMyAppliesController,
  ListAppliesByJobController,
  ReadApplyController,
  UpdateApplyController,
  DeleteApplyController,
];

@Module({
  imports: [
    JobModule,
    UserModule,
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

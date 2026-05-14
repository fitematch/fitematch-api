import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardSummaryController } from '@src/modules/dashboard/adapters/http/controllers/dashboard-summary.controller';
import { dashboardProviders } from '@src/modules/dashboard/infrastructure/providers/dashboard.providers';
import {
  UserSchema,
  UserSchemaFactory,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import {
  CompanySchema,
  CompanySchemaFactory,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import {
  JobSchema,
  JobSchemaFactory,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import {
  ApplySchema,
  ApplySchemaFactory,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';

const importedControllers = [DashboardSummaryController];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchema.name,
        schema: UserSchemaFactory,
      },
      {
        name: CompanySchema.name,
        schema: CompanySchemaFactory,
      },
      {
        name: JobSchema.name,
        schema: JobSchemaFactory,
      },
      {
        name: ApplySchema.name,
        schema: ApplySchemaFactory,
      },
    ]),
  ],
  controllers: [...importedControllers],
  providers: [...dashboardProviders],
  exports: [...dashboardProviders, MongooseModule],
})
export class DashboardModule {}

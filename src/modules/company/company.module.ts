import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { companyProviders } from '@src/modules/company/infrastructure/providers/company.providers';
import {
  CompanySchema,
  CompanySchemaFactory,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { ListCompanyController } from '@src/modules/company/adapters/http/controllers/list-company.controller';
import { CreateCompanyController } from '@src/modules/company/adapters/http/controllers/create-company.controller';
import { ReadCompanyController } from '@src/modules/company/adapters/http/controllers/read-company.controller';

const importedControllers = [
  ListCompanyController,
  CreateCompanyController,
  ReadCompanyController,
];
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CompanySchema.name,
        schema: CompanySchemaFactory,
      },
    ]),
  ],
  controllers: [...importedControllers],
  providers: [...companyProviders],
  exports: [...companyProviders, MongooseModule],
})
export class CompanyModule {}

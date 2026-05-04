import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { companyProviders } from '@src/modules/company/infrastructure/providers/company.providers';
import {
  CompanySchema,
  CompanySchemaFactory,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import {
  UserSchema,
  UserSchemaFactory,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { ListCompanyController } from '@src/modules/company/adapters/http/controllers/list-company.controller';
import { CreateCompanyController } from '@src/modules/company/adapters/http/controllers/create-company.controller';
import { ReadCompanyController } from '@src/modules/company/adapters/http/controllers/read-company.controller';
import { UpdateCompanyController } from '@src/modules/company/adapters/http/controllers/update-company.controller';
import { DeleteCompanyController } from '@src/modules/company/adapters/http/controllers/delete-company.controller';
import { ListPublicCompaniesController } from '@src/modules/company/adapters/http/controllers/list-public-companies.controller';
import { ReadMyCompanyController } from '@src/modules/company/adapters/http/controllers/read-my-company.controller';
import { CreateMyCompanyController } from '@src/modules/company/adapters/http/controllers/create-my-company.controller';
import { UpdateMyCompanyController } from '@src/modules/company/adapters/http/controllers/update-my-company.controller';

const importedControllers = [
  ListCompanyController,
  CreateCompanyController,
  ListPublicCompaniesController,
  ReadMyCompanyController,
  CreateMyCompanyController,
  UpdateMyCompanyController,
  ReadCompanyController,
  UpdateCompanyController,
  DeleteCompanyController,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CompanySchema.name,
        schema: CompanySchemaFactory,
      },
      {
        name: UserSchema.name,
        schema: UserSchemaFactory,
      },
    ]),
  ],
  controllers: [...importedControllers],
  providers: [...companyProviders],
  exports: [...companyProviders, MongooseModule],
})
export class CompanyModule {} // feat(company): link recruiter company on company me creation

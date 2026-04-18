import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import apiConfig from '@src/shared/infrastructure/config/api.config';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckModule } from '@src/modules/health-check/health-check.module';
import { UserModule } from '@src/modules/user/user.module';
import { CompanyModule } from '@src/modules/company/company.module';
import { JobModule } from '@src/modules/job/job.module';

const databaseUri = process.env.DATABASE_URI;
const importedModules = [
  HealthCheckModule,
  UserModule,
  CompanyModule,
  JobModule,
];
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig],
      isGlobal: true,
    }),
    ...(databaseUri
      ? [
          MongooseModule.forRoot(databaseUri, {
            dbName: process.env.DATABASE_NAME,
          }),
        ]
      : []),
    ...importedModules,
  ],
})
export class AppModule {}

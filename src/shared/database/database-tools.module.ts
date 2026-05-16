import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import apiConfig from '@src/shared/infrastructure/config/api.config';
import {
  EmailTemplateSchemaFactory,
  EmailTemplateSchema,
} from '@src/modules/email-template/infrastructure/database/mongoose/schemas/email-template.schema';
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
  MigrationSchema,
  MigrationSchemaFactory,
} from '@src/shared/database/migrations/schemas/migration.schema';
import {
  SeedSchema,
  SeedSchemaFactory,
} from '@src/shared/database/seeds/schemas/seed.schema';
import {
  LockSchema,
  LockSchemaFactory,
} from '@src/shared/database/locks/schemas/lock.schema';
import { databaseToolsProviders } from '@src/shared/database/infrastructure/providers/database-tools.providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('DATABASE_URI'),
        dbName: configService.get<string>('DATABASE_NAME'),
      }),
    }),
    MongooseModule.forFeature([
      {
        name: MigrationSchema.name,
        schema: MigrationSchemaFactory,
      },
      {
        name: SeedSchema.name,
        schema: SeedSchemaFactory,
      },
      {
        name: LockSchema.name,
        schema: LockSchemaFactory,
      },
      {
        name: EmailTemplateSchema.name,
        schema: EmailTemplateSchemaFactory,
      },
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
    ]),
  ],
  providers: [...databaseToolsProviders],
  exports: [...databaseToolsProviders, MongooseModule],
})
export class DatabaseToolsModule {}

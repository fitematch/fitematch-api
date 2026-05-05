import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import apiConfig from '@src/shared/infrastructure/config/api.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthCheckModule } from '@src/modules/health-check/health-check.module';
import { UserModule } from '@src/modules/user/user.module';
import { CompanyModule } from '@src/modules/company/company.module';
import { JobModule } from '@src/modules/job/job.module';
import { ApplyModule } from '@src/modules/apply/apply.module';
import { AuthModule } from '@src/modules/auth/auth.module';

const importedModules = [
  HealthCheckModule,
  AuthModule,
  UserModule,
  CompanyModule,
  JobModule,
  ApplyModule,
];
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
    ...importedModules,
  ],
})
export class AppModule {}

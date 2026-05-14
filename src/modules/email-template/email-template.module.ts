import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@src/modules/auth/auth.module';
import { ListEmailTemplateController } from '@src/modules/email-template/adapters/http/controllers/list-email-template.controller';
import { ReadEmailTemplateController } from '@src/modules/email-template/adapters/http/controllers/read-email-template.controller';
import { UpdateEmailTemplateController } from '@src/modules/email-template/adapters/http/controllers/update-email-template.controller';
import { ResetEmailTemplateController } from '@src/modules/email-template/adapters/http/controllers/reset-email-template.controller';
import { TestEmailTemplateController } from '@src/modules/email-template/adapters/http/controllers/test-email-template.controller';
import { emailTemplateProviders } from '@src/modules/email-template/infrastructure/providers/email-template.providers';
import {
  EmailTemplateSchema,
  EmailTemplateSchemaFactory,
} from '@src/modules/email-template/infrastructure/database/mongoose/schemas/email-template.schema';

const importedControllers = [
  ListEmailTemplateController,
  ReadEmailTemplateController,
  UpdateEmailTemplateController,
  ResetEmailTemplateController,
  TestEmailTemplateController,
];

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: EmailTemplateSchema.name,
        schema: EmailTemplateSchemaFactory,
      },
    ]),
  ],
  controllers: [...importedControllers],
  providers: [...emailTemplateProviders],
  exports: [...emailTemplateProviders, MongooseModule],
})
export class EmailTemplateModule {}

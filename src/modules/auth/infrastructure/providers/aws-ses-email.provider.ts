import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';

import type {
  EmailProviderInterface,
  SendActivationCodeEmailInput,
} from '@src/modules/auth/application/contracts/providers/email-provider.interface';
import { activationCodeEmailTemplate } from '@src/modules/auth/infrastructure/providers/templates/activation-code-email.template';

@Injectable()
export class AwsSesEmailProvider implements EmailProviderInterface {
  private readonly sesClient: SESv2Client;

  constructor() {
    this.sesClient = new SESv2Client({
      region:
        process.env.AWS_SES_REGION || process.env.AWS_REGION || 'sa-east-1',
    });
  }

  public async sendActivationCode(
    input: SendActivationCodeEmailInput,
  ): Promise<void> {
    const senderEmail = process.env.AWS_SES_SENDER_EMAIL;
    const senderName = process.env.AWS_SES_SENDER_NAME || 'fitematch';

    const missingConfig = [!senderEmail ? 'AWS_SES_SENDER_EMAIL' : null].filter(
      (value): value is string => value !== null,
    );

    if (missingConfig.length > 0) {
      throw new InternalServerErrorException(
        `AWS SES email provider is not configured. Missing: ${missingConfig.join(', ')}.`,
      );
    }

    try {
      await this.sesClient.send(
        new SendEmailCommand({
          FromEmailAddress: `"${senderName}" <${senderEmail}>`,
          Destination: {
            ToAddresses: [
              input.name ? `"${input.name}" <${input.to}>` : input.to,
            ],
          },
          Content: {
            Simple: {
              Subject: {
                Charset: 'UTF-8',
                Data: 'Seu codigo de ativacao fitematch',
              },
              Body: {
                Html: {
                  Charset: 'UTF-8',
                  Data: activationCodeEmailTemplate({
                    name: input.name,
                    code: input.code,
                    expiresInMinutes: input.expiresInMinutes,
                  }),
                },
              },
            },
          },
        }),
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown AWS SES error';

      throw new InternalServerErrorException(
        `AWS SES failed to send activation email: ${message}`,
      );
    }
  }
}

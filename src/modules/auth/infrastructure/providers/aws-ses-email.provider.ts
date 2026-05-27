import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { SESClientConfig } from '@aws-sdk/client-ses';

import type { ApiConfig } from '@src/shared/infrastructure/config/api.config';
import type {
  EmailProviderInterface,
  SendEmailInput,
} from '@src/modules/auth/application/providers/email.provider.interface';

interface ActivationCodePayload {
  to: string;
  name?: string;
  code: string;
  expiresInMinutes?: number;
}

@Injectable()
export class AwsSesEmailProvider implements EmailProviderInterface {
  private readonly sesClient: SESClient;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiConfig = this.configService.get<ApiConfig>('api');
    const awsConfig = apiConfig?.aws;
    const region =
      process.env.AWS_SES_REGION ?? awsConfig?.region ?? 'sa-east-1';
    const accessKeyId = (awsConfig?.accessKeyId ?? '').trim();
    const secretAccessKey = (awsConfig?.secretAccessKey ?? '').trim();

    this.fromEmail = (
      process.env.AWS_SES_SENDER_EMAIL ??
      process.env.AWS_FROM_EMAIL ??
      awsConfig?.fromEmail ??
      'no-reply@fitematch.com.br'
    ).trim();

    const sesClientOptions: SESClientConfig = {
      region,
      ...(accessKeyId !== '' && secretAccessKey !== ''
        ? {
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          }
        : {}),
    };

    this.sesClient = new SESClient(sesClientOptions);
  }

  public async sendActivationCode(
    to: string | ActivationCodePayload,
    code?: string,
  ): Promise<void> {
    let emailDestino = '';
    let codigoAtivacao = code ?? '';

    if (to && typeof to === 'object') {
      emailDestino = to.to;
      codigoAtivacao = to.code ?? codigoAtivacao;
    } else if (typeof to === 'string') {
      emailDestino = to;
    }

    if (!emailDestino) {
      throw new InternalServerErrorException(
        'Destinatário inválido para o código de ativação.',
      );
    }

    await this.send({
      to: emailDestino,
      subject: 'Seu Código de Ativação - FiteMatch',
      body: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1a202c;">Olá!</h2>
          <p style="color: #4a5568; font-size: 16px;">Seu código de ativação para o <strong>FiteMatch</strong> é:</p>
          <div style="background-color: #f7fafc; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #2b6cb0; letter-spacing: 4px;">${codigoAtivacao}</span>
          </div>
          <p style="color: #718096; font-size: 14px;">Use este código no aplicativo para confirmar sua conta.</p>
        </div>
      `,
    });
  }

  public async send(input: SendEmailInput): Promise<void> {
    if (!this.fromEmail) {
      throw new InternalServerErrorException(
        'AWS_FROM_EMAIL configuration is required to send emails via AWS SES.',
      );
    }

    let targetEmail: string | string[];

    if (input.to && typeof input.to === 'object' && !Array.isArray(input.to)) {
      const complexTo = input.to as unknown as Record<string, unknown>;
      targetEmail = typeof complexTo.to === 'string' ? complexTo.to : '';
    } else {
      targetEmail = input.to;
    }

    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: {
        ToAddresses: Array.isArray(targetEmail) ? targetEmail : [targetEmail],
      },
      Message: {
        Subject: {
          Data: input.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: input.body,
            Charset: 'UTF-8',
          },
        },
      },
    });

    try {
      await this.sesClient.send(command);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Failed to send email via AWS SES: ${error.message}`,
        );
      }

      throw new InternalServerErrorException('Unknown AWS SES execution error');
    }
  }
}

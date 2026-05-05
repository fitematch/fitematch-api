import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import type {
  EmailProviderInterface,
  SendActivationCodeEmailInput,
} from '@src/modules/auth/application/contracts/providers/email-provider.interface';
import { activationCodeEmailTemplate } from '@src/modules/auth/infrastructure/providers/templates/activation-code-email.template';

@Injectable()
export class MailtrapEmailProvider implements EmailProviderInterface {
  async sendActivationCode(input: SendActivationCodeEmailInput): Promise<void> {
    const host = process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io';
    const port = Number(process.env.MAILTRAP_PORT || '2525');
    const user = process.env.MAILTRAP_USER;
    const password = process.env.MAILTRAP_PASSWORD;
    const senderEmail = process.env.MAILTRAP_SENDER_EMAIL;
    const senderName = process.env.MAILTRAP_SENDER_NAME || 'fitematch';

    const missingConfig = [
      !user ? 'MAILTRAP_USER' : null,
      !password ? 'MAILTRAP_PASSWORD' : null,
      !senderEmail ? 'MAILTRAP_SENDER_EMAIL' : null,
    ].filter((value): value is string => value !== null);

    if (missingConfig.length > 0) {
      throw new InternalServerErrorException(
        `Mailtrap email provider is not configured. Missing: ${missingConfig.join(', ')}.`,
      );
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        requireTLS: false,
        authMethod: 'PLAIN',
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        auth: {
          user,
          pass: password,
        },
      });

      await transporter.verify();

      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: input.name ? `"${input.name}" <${input.to}>` : input.to,
        subject: 'Seu codigo de ativacao fitematch',
        html: activationCodeEmailTemplate({
          name: input.name,
          code: input.code,
          expiresInMinutes: input.expiresInMinutes,
        }),
      });
    } catch (error: unknown) {
      const smtpError = error as SMTPTransport.SentMessageInfo &
        Partial<Error> & {
          code?: string;
          response?: string;
          command?: string;
        };
      const message =
        error instanceof Error ? error.message : 'Unknown Mailtrap error';
      const details = [smtpError.code, smtpError.command, smtpError.response]
        .filter((value): value is string => Boolean(value))
        .join(' | ');
      throw new InternalServerErrorException(
        `Mailtrap failed to send activation email: ${details ? `${message} (${details})` : message}`,
      );
    }
  }
}

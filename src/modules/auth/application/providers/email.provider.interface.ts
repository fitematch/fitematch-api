export interface SendEmailInput {
  to: string | string[];
  subject: string;
  body: string;
}

export interface EmailProviderInterface {
  send(input: SendEmailInput): Promise<void>;
}

export const EMAIL_PROVIDER = 'EmailProvider';

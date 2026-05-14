export interface SendActivationCodeEmailInput {
  to: string;
  name: string;
  code: string;
  expiresInMinutes: number;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export interface EmailProviderInterface {
  sendActivationCode(input: SendActivationCodeEmailInput): Promise<void>;
  sendEmail(input: SendEmailInput): Promise<void>;
}

export interface SendActivationCodeEmailInput {
  to: string;
  name: string;
  code: string;
  expiresInMinutes: number;
}

export interface EmailProviderInterface {
  sendActivationCode(input: SendActivationCodeEmailInput): Promise<void>;
}

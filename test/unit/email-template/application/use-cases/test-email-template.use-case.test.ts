import type { EmailProviderInterface } from '@src/modules/auth/application/contracts/providers/email-provider.interface';
import type { TestEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/test-email-template.repository.interface';
import { TestEmailTemplateUseCase } from '@src/modules/email-template/application/use-cases/test-email-template.use-case';

describe('TestEmailTemplateUseCase', () => {
  let useCase: TestEmailTemplateUseCase;
  let repository: jest.Mocked<TestEmailTemplateRepositoryInterface>;
  let emailProvider: jest.Mocked<EmailProviderInterface>;

  beforeEach(() => {
    repository = {
      ensureDefaults: jest.fn(),
      read: jest.fn(),
    } as jest.Mocked<TestEmailTemplateRepositoryInterface>;
    emailProvider = {
      sendActivationCode: jest.fn(),
      sendEmail: jest.fn(),
    } as jest.Mocked<EmailProviderInterface>;

    useCase = new TestEmailTemplateUseCase(repository, emailProvider);
  });

  it('should send a rendered test email when the template exists', async () => {
    repository.ensureDefaults.mockResolvedValue();
    repository.read.mockResolvedValue({
      id: 'template-1',
      slug: 'company-approved',
      name: 'Company Approved',
      description: 'Company approved email',
      subject: 'Empresa aprovada: {{companyName}}',
      preheader: 'Olá {{userName}}',
      body: '<p>{{companyName}} - {{jobTitle}}</p>',
      defaultSubject: 'Empresa aprovada: {{companyName}}',
      defaultPreheader: 'Olá {{userName}}',
      defaultBody: '<p>{{companyName}} - {{jobTitle}}</p>',
      variables: [],
      isSystem: true,
    });
    emailProvider.sendEmail.mockResolvedValue();

    const result = await useCase.execute({
      id: 'template-1',
      email: 'admin@email.com',
    });

    expect(result).toEqual({
      message: 'Test email sent successfully.',
    });
    expect(repository.ensureDefaults).toHaveBeenCalledTimes(1);
    expect(repository.read).toHaveBeenCalledWith({
      id: 'template-1',
    });
    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: 'admin@email.com',
      subject: 'Empresa aprovada: Academia Fit Pro',
      html: expect.stringContaining('Academia Fit Pro - Personal Trainer'),
    });
  });

  it('should return null when the template does not exist', async () => {
    repository.ensureDefaults.mockResolvedValue();
    repository.read.mockResolvedValue(null);

    const result = await useCase.execute({
      id: 'missing-template',
      email: 'admin@email.com',
    });

    expect(result).toBeNull();
    expect(emailProvider.sendEmail).not.toHaveBeenCalled();
  });
});

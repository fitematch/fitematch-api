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
    };
    emailProvider = {
      sendActivationCode: jest.fn(),
      sendEmail: jest.fn(),
    };

    useCase = new TestEmailTemplateUseCase(repository, emailProvider);
  });

  it('should send a rendered test email when the template exists', async () => {
    repository.ensureDefaults.mockResolvedValue();
    repository.read.mockResolvedValue({
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
      isActive: true,
      category: 'company',
      version: 1,
    });
    emailProvider.sendEmail.mockResolvedValue();

    const result = await useCase.execute({
      slug: 'company-approved',
      email: 'admin@email.com',
    });

    expect(result).toEqual({
      message: 'Test email sent successfully.',
    });
    expect(repository.ensureDefaults).toHaveBeenCalledTimes(1);
    expect(repository.read).toHaveBeenCalledWith({
      slug: 'company-approved',
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
      slug: 'missing-template',
      email: 'admin@email.com',
    });

    expect(result).toBeNull();
    expect(emailProvider.sendEmail).not.toHaveBeenCalled();
  });
});

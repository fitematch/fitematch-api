import type { ResetEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/reset-email-template.repository.interface';
import { ResetEmailTemplateUseCase } from '@src/modules/email-template/application/use-cases/reset-email-template.use-case';

describe('ResetEmailTemplateUseCase', () => {
  let useCase: ResetEmailTemplateUseCase;
  let repository: jest.Mocked<ResetEmailTemplateRepositoryInterface>;

  beforeEach(() => {
    repository = {
      ensureDefaults: jest.fn(),
      reset: jest.fn(),
    };

    useCase = new ResetEmailTemplateUseCase(repository);
  });

  it('should ensure defaults and reset a template', async () => {
    const output = {
      slug: 'activation-code',
      name: 'Activation Code',
      description: 'Activation email',
      subject: 'Default subject',
      preheader: 'Default preheader',
      body: '<p>Default body</p>',
      defaultSubject: 'Default subject',
      defaultPreheader: 'Default preheader',
      defaultBody: '<p>Default body</p>',
      variables: [],
      isSystem: true,
      isActive: true,
      category: 'auth',
      version: 1,
    };

    repository.ensureDefaults.mockResolvedValue();
    repository.reset.mockResolvedValue(output);

    const result = await useCase.execute({ slug: 'activation-code' });

    expect(result).toEqual(output);
    expect(repository.ensureDefaults).toHaveBeenCalledTimes(1);
    expect(repository.reset).toHaveBeenCalledWith({ slug: 'activation-code' });
  });
});

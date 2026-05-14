import type { ResetEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/reset-email-template.repository.interface';
import { ResetEmailTemplateUseCase } from '@src/modules/email-template/application/use-cases/reset-email-template.use-case';

describe('ResetEmailTemplateUseCase', () => {
  let useCase: ResetEmailTemplateUseCase;
  let repository: jest.Mocked<ResetEmailTemplateRepositoryInterface>;

  beforeEach(() => {
    repository = {
      ensureDefaults: jest.fn(),
      reset: jest.fn(),
    } as jest.Mocked<ResetEmailTemplateRepositoryInterface>;

    useCase = new ResetEmailTemplateUseCase(repository);
  });

  it('should ensure defaults and reset a template', async () => {
    const output = {
      id: 'template-1',
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
    };

    repository.ensureDefaults.mockResolvedValue();
    repository.reset.mockResolvedValue(output);

    const result = await useCase.execute({ id: 'template-1' });

    expect(result).toEqual(output);
    expect(repository.ensureDefaults).toHaveBeenCalledTimes(1);
    expect(repository.reset).toHaveBeenCalledWith({ id: 'template-1' });
  });
});

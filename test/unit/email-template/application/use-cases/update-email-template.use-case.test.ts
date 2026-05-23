import type { UpdateEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/update-email-template.repository.interface';
import { UpdateEmailTemplateUseCase } from '@src/modules/email-template/application/use-cases/update-email-template.use-case';

describe('UpdateEmailTemplateUseCase', () => {
  let useCase: UpdateEmailTemplateUseCase;
  let repository: jest.Mocked<UpdateEmailTemplateRepositoryInterface>;

  beforeEach(() => {
    repository = {
      ensureDefaults: jest.fn(),
      update: jest.fn(),
    };

    useCase = new UpdateEmailTemplateUseCase(repository);
  });

  it('should ensure defaults and update a template', async () => {
    const input = {
      slug: 'activation-code',
      name: 'Activation code',
      description: 'Activation email',
      subject: 'New subject',
      preheader: 'New preheader',
      body: '<p>New body</p>',
      isActive: true,
      category: 'auth',
    };

    const output = {
      ...input,
      defaultSubject: 'Default subject',
      defaultPreheader: 'Default preheader',
      defaultBody: '<p>Default body</p>',
      variables: [],
      isSystem: true,
      version: 1,
    };

    repository.ensureDefaults.mockResolvedValue();
    repository.update.mockResolvedValue(output);

    const result = await useCase.execute(input);

    expect(result).toEqual(output);
    expect(repository.ensureDefaults).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(input);
  });
});

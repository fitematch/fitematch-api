import type { ReadEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/read-email-template.repository.interface';
import { ReadEmailTemplateUseCase } from '@src/modules/email-template/application/use-cases/read-email-template.use-case';

describe('ReadEmailTemplateUseCase', () => {
  let useCase: ReadEmailTemplateUseCase;
  let repository: jest.Mocked<ReadEmailTemplateRepositoryInterface>;

  beforeEach(() => {
    repository = {
      ensureDefaults: jest.fn(),
      read: jest.fn(),
    } as jest.Mocked<ReadEmailTemplateRepositoryInterface>;

    useCase = new ReadEmailTemplateUseCase(repository);
  });

  it('should ensure defaults and read a template by id', async () => {
    const output = {
      id: 'template-1',
      slug: 'activation-code',
      name: 'Activation Code',
      description: 'Activation email',
      subject: 'Subject',
      preheader: 'Preheader',
      body: '<p>Body</p>',
      defaultSubject: 'Subject',
      defaultPreheader: 'Preheader',
      defaultBody: '<p>Body</p>',
      variables: [],
      isSystem: true,
    };

    repository.ensureDefaults.mockResolvedValue();
    repository.read.mockResolvedValue(output);

    const result = await useCase.execute({ id: 'template-1' });

    expect(result).toEqual(output);
    expect(repository.ensureDefaults).toHaveBeenCalledTimes(1);
    expect(repository.read).toHaveBeenCalledWith({ id: 'template-1' });
  });
});

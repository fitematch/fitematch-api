import type { ListEmailTemplateRepositoryInterface } from '@src/modules/email-template/application/contracts/repositories/list-email-template.repository.interface';
import { ListEmailTemplateUseCase } from '@src/modules/email-template/application/use-cases/list-email-template.use-case';

describe('ListEmailTemplateUseCase', () => {
  let useCase: ListEmailTemplateUseCase;
  let repository: jest.Mocked<ListEmailTemplateRepositoryInterface>;

  beforeEach(() => {
    repository = {
      ensureDefaults: jest.fn(),
      list: jest.fn(),
    } as jest.Mocked<ListEmailTemplateRepositoryInterface>;

    useCase = new ListEmailTemplateUseCase(repository);
  });

  it('should ensure defaults and return the template list', async () => {
    const output = [
      {
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
        isActive: true,
        category: 'auth',
        version: 1,
      },
    ];

    repository.ensureDefaults.mockResolvedValue();
    repository.list.mockResolvedValue(output);

    const result = await useCase.execute();

    expect(result).toEqual(output);
    expect(repository.ensureDefaults).toHaveBeenCalledTimes(1);
    expect(repository.list).toHaveBeenCalledTimes(1);
  });
});

import { ListEmailTemplateController } from '@src/modules/email-template/adapters/http/controllers/list-email-template.controller';
import type { ListEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/list-email-template.use-case.interface';

describe('ListEmailTemplateController', () => {
  let controller: ListEmailTemplateController;
  let useCase: jest.Mocked<ListEmailTemplateUseCaseInterface>;

  beforeEach(() => {
    useCase = {
      execute: jest.fn(),
    } as jest.Mocked<ListEmailTemplateUseCaseInterface>;

    controller = new ListEmailTemplateController(useCase);
  });

  it('should return the mapped template list', async () => {
    useCase.execute.mockResolvedValue([
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
    ]);

    const result = await controller.handle();

    expect(result).toEqual([
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
        createdAt: undefined,
        updatedAt: undefined,
      },
    ]);
  });
});

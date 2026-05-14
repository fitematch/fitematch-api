import { NotFoundException } from '@nestjs/common';
import { ReadEmailTemplateController } from '@src/modules/email-template/adapters/http/controllers/read-email-template.controller';
import type { ReadEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/read-email-template.use-case.interface';

describe('ReadEmailTemplateController', () => {
  let controller: ReadEmailTemplateController;
  let useCase: jest.Mocked<ReadEmailTemplateUseCaseInterface>;

  beforeEach(() => {
    useCase = {
      execute: jest.fn(),
    } as jest.Mocked<ReadEmailTemplateUseCaseInterface>;

    controller = new ReadEmailTemplateController(useCase);
  });

  it('should return the mapped template', async () => {
    useCase.execute.mockResolvedValue({
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
    });

    const result = await controller.handle({ id: 'template-1' });

    expect(result.id).toBe('template-1');
    expect(useCase.execute).toHaveBeenCalledWith({ id: 'template-1' });
  });

  it('should throw not found when template does not exist', async () => {
    useCase.execute.mockResolvedValue(null);

    await expect(controller.handle({ id: 'missing-template' })).rejects.toThrow(
      new NotFoundException('Email template not found.'),
    );
  });
});

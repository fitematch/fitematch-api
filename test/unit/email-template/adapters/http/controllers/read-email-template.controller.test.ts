import { NotFoundException } from '@nestjs/common';
import { ReadEmailTemplateController } from '@src/modules/email-template/adapters/http/controllers/read-email-template.controller';
import type { ReadEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/read-email-template.use-case.interface';

describe('ReadEmailTemplateController', () => {
  let controller: ReadEmailTemplateController;
  let useCase: jest.Mocked<ReadEmailTemplateUseCaseInterface>;

  beforeEach(() => {
    useCase = {
      execute: jest.fn(),
    };

    controller = new ReadEmailTemplateController(useCase);
  });

  it('should return the mapped template', async () => {
    useCase.execute.mockResolvedValue({
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
    });

    const result = await controller.handle({ slug: 'activation-code' });

    expect(result.slug).toBe('activation-code');
    expect(useCase.execute).toHaveBeenCalledWith({ slug: 'activation-code' });
  });

  it('should throw not found when template does not exist', async () => {
    useCase.execute.mockResolvedValue(null);

    await expect(
      controller.handle({ slug: 'missing-template' }),
    ).rejects.toThrow(new NotFoundException('Email template not found.'));
  });
});

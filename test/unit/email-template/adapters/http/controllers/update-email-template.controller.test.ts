import { NotFoundException } from '@nestjs/common';
import { UpdateEmailTemplateController } from '@src/modules/email-template/adapters/http/controllers/update-email-template.controller';
import type { UpdateEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/update-email-template.use-case.interface';

describe('UpdateEmailTemplateController', () => {
  let controller: UpdateEmailTemplateController;
  let useCase: jest.Mocked<UpdateEmailTemplateUseCaseInterface>;

  beforeEach(() => {
    useCase = {
      execute: jest.fn(),
    } as jest.Mocked<UpdateEmailTemplateUseCaseInterface>;

    controller = new UpdateEmailTemplateController(useCase);
  });

  it('should return the updated template', async () => {
    useCase.execute.mockResolvedValue({
      slug: 'activation-code',
      name: 'Activation Code',
      description: 'Activation email',
      subject: 'New subject',
      preheader: 'New preheader',
      body: '<p>New body</p>',
      defaultSubject: 'Default subject',
      defaultPreheader: 'Default preheader',
      defaultBody: '<p>Default body</p>',
      variables: [],
      isSystem: true,
      isActive: true,
      category: 'auth',
      version: 1,
    });

    const result = await controller.handle(
      { slug: 'activation-code' },
      {
        name: 'Activation Code',
        description: 'Activation email',
        subject: 'New subject',
        preheader: 'New preheader',
        body: '<p>New body</p>',
        isActive: true,
        category: 'auth',
      },
    );

    expect(result.subject).toBe('New subject');
    expect(useCase.execute).toHaveBeenCalledWith({
      slug: 'activation-code',
      name: 'Activation Code',
      description: 'Activation email',
      subject: 'New subject',
      preheader: 'New preheader',
      body: '<p>New body</p>',
      isActive: true,
      category: 'auth',
    });
  });

  it('should throw not found when template does not exist', async () => {
    useCase.execute.mockResolvedValue(null);

    await expect(
      controller.handle(
        { slug: 'missing-template' },
        {
          name: 'Activation Code',
          description: 'Activation email',
          subject: 'Subject',
          preheader: 'Preheader',
          body: '<p>Body</p>',
          isActive: true,
          category: 'auth',
        },
      ),
    ).rejects.toThrow(new NotFoundException('Email template not found.'));
  });
});

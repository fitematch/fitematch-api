import { NotFoundException } from '@nestjs/common';
import { ResetEmailTemplateController } from '@src/modules/email-template/adapters/http/controllers/reset-email-template.controller';
import type { ResetEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/reset-email-template.use-case.interface';

describe('ResetEmailTemplateController', () => {
  let controller: ResetEmailTemplateController;
  let useCase: jest.Mocked<ResetEmailTemplateUseCaseInterface>;

  beforeEach(() => {
    useCase = {
      execute: jest.fn(),
    };

    controller = new ResetEmailTemplateController(useCase);
  });

  it('should return the reset template', async () => {
    useCase.execute.mockResolvedValue({
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
    });

    const result = await controller.handle({ slug: 'activation-code' });

    expect(result.subject).toBe('Default subject');
    expect(useCase.execute).toHaveBeenCalledWith({ slug: 'activation-code' });
  });

  it('should throw not found when template does not exist', async () => {
    useCase.execute.mockResolvedValue(null);

    await expect(
      controller.handle({ slug: 'missing-template' }),
    ).rejects.toThrow(new NotFoundException('Email template not found.'));
  });
});

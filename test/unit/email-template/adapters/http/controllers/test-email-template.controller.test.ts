import { NotFoundException } from '@nestjs/common';
import { TestEmailTemplateController } from '@src/modules/email-template/adapters/http/controllers/test-email-template.controller';
import type { TestEmailTemplateUseCaseInterface } from '@src/modules/email-template/application/contracts/use-cases/test-email-template.use-case.interface';

describe('TestEmailTemplateController', () => {
  let controller: TestEmailTemplateController;
  let useCase: jest.Mocked<TestEmailTemplateUseCaseInterface>;

  beforeEach(() => {
    useCase = {
      execute: jest.fn(),
    } as jest.Mocked<TestEmailTemplateUseCaseInterface>;

    controller = new TestEmailTemplateController(useCase);
  });

  it('should return the success message', async () => {
    useCase.execute.mockResolvedValue({
      message: 'Test email sent successfully.',
    });

    const result = await controller.handle(
      { id: 'template-1' },
      { email: 'admin@email.com' },
    );

    expect(result).toEqual({
      message: 'Test email sent successfully.',
    });
    expect(useCase.execute).toHaveBeenCalledWith({
      id: 'template-1',
      email: 'admin@email.com',
    });
  });

  it('should throw not found when template does not exist', async () => {
    useCase.execute.mockResolvedValue(null);

    await expect(
      controller.handle(
        { id: 'missing-template' },
        { email: 'admin@email.com' },
      ),
    ).rejects.toThrow(new NotFoundException('Email template not found.'));
  });
});

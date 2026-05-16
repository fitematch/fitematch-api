import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateEmailTemplateRequestDto } from '@src/modules/email-template/adapters/http/dto/request/update-email-template.request.dto';
import { TestEmailTemplateRequestDto } from '@src/modules/email-template/adapters/http/dto/request/test-email-template.request.dto';

describe('EmailTemplateRequestDto', () => {
  it('should validate required fields on update request', async () => {
    const dto = plainToInstance(UpdateEmailTemplateRequestDto, {
      name: '',
      subject: '',
      body: '',
      isActive: true,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(3);
  });

  it('should validate email on test request', async () => {
    const dto = plainToInstance(TestEmailTemplateRequestDto, {
      email: 'invalid-email',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.property).toBe('email');
  });
});

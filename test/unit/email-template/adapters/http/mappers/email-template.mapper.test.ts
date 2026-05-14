import { EmailTemplateMapper } from '@src/modules/email-template/adapters/http/mappers/email-template.mapper';
import { TestEmailTemplateMapper } from '@src/modules/email-template/adapters/http/mappers/test-email-template.mapper';

describe('EmailTemplateMappers', () => {
  it('should map an email template output to response', () => {
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
      variables: [
        {
          key: '{{userName}}',
          description: 'User full name',
        },
      ],
      isSystem: true,
    };

    const result = EmailTemplateMapper.toResponse(output);

    expect(result).toEqual(output);
  });

  it('should map a test email output to response', () => {
    const result = TestEmailTemplateMapper.toResponse({
      message: 'Test email sent successfully.',
    });

    expect(result).toEqual({
      message: 'Test email sent successfully.',
    });
  });
});

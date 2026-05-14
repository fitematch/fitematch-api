import { EmailTemplateRenderer } from '@src/modules/email-template/infrastructure/providers/email-template.renderer';

describe('EmailTemplateRenderer', () => {
  it('should render known variables with fake values', () => {
    const result = EmailTemplateRenderer.render(
      'Olá {{userName}} - {{companyName}} - {{jobTitle}} - {{activationCode}}',
      EmailTemplateRenderer.getFakeVariables(),
    );

    expect(result).toBe(
      'Olá Thiago - Academia Fit Pro - Personal Trainer - 123456',
    );
  });

  it('should build email html with preheader and body', () => {
    const result = EmailTemplateRenderer.buildHtml({
      preheader: 'Preheader',
      body: '<p>Body</p>',
    });

    expect(result).toContain('Preheader');
    expect(result).toContain('<p>Body</p>');
  });
});

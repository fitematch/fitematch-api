const fakeVariables = {
  '{{userName}}': 'Thiago',
  '{{companyName}}': 'Academia Fit Pro',
  '{{jobTitle}}': 'Personal Trainer',
  '{{candidateName}}': 'Camila Souza',
  '{{applicationStatus}}': 'Em análise',
  '{{reason}}': 'Ajustar algumas informações antes do próximo passo.',
  '{{activationCode}}': '123456',
};

export class EmailTemplateRenderer {
  static getFakeVariables(): Record<string, string> {
    return fakeVariables;
  }

  static render(value: string, variables: Record<string, string>): string {
    let renderedValue = value;

    Object.entries(variables).forEach(([key, replacement]) => {
      renderedValue = renderedValue.replaceAll(key, replacement);
    });

    return renderedValue;
  }

  static buildHtml(input: { preheader: string; body: string }): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>fitematch</title>
  </head>
  <body style="margin:0;padding:24px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${input.preheader}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:16px;padding:32px;">
            <tr>
              <td>
                ${input.body}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
  }
}

interface ActivationCodeEmailTemplateInput {
  name: string;
  code: string;
  expiresInMinutes: number;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function activationCodeEmailTemplate({
  name,
  code,
  expiresInMinutes,
}: ActivationCodeEmailTemplateInput): string {
  const safeName = escapeHtml(name);
  const safeCode = escapeHtml(code);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Código de ativação fitematch</title>
  </head>

  <body style="margin:0;padding:0;background-color:#030712;font-family:Arial,Helvetica,sans-serif;color:#f3f4f6;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#030712;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#000000;border:1px solid #374151;border-radius:24px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 16px;text-align:center;">
                <div style="font-size:28px;font-weight:800;color:#f9fafb;letter-spacing:-0.04em;">
                  fitematch
                </div>

                <p style="margin:12px 0 0;color:#9ca3af;font-size:14px;">
                  Ativação de conta
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 0;">
                <h1 style="margin:0;color:#f9fafb;font-size:24px;line-height:1.3;">
                  Olá, ${safeName}
                </h1>

                <p style="margin:16px 0 0;color:#d1d5db;font-size:15px;line-height:1.7;">
                  Use o código abaixo para ativar sua conta na fitematch.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 32px;text-align:center;">
                <div style="display:inline-block;background-color:#111827;border:1px solid #4b5563;border-radius:18px;padding:18px 28px;">
                  <span style="display:block;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.18em;margin-bottom:8px;">
                    Código de ativação
                  </span>

                  <span style="display:block;color:#f9fafb;font-size:36px;font-weight:800;letter-spacing:0.22em;">
                    ${safeCode}
                  </span>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 32px 28px;">
                <p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.7;">
                  Este código expira em <strong style="color:#f9fafb;">${expiresInMinutes} minutos</strong>.
                  Caso você não tenha solicitado este cadastro, ignore este e-mail.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px;background-color:#030712;border-top:1px solid #1f2937;">
                <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;text-align:center;">
                  © fitematch. E-mail automático, não responda esta mensagem.
                </p>
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

export function contactConfirmationHtml({
  name,
  subjectLabel,
}: {
  name: string
  subjectLabel: string
}): string {
  return /* html */ `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Twoja wiadomość dotarła — Nobile Pet Care</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF7F2;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF7F2;">
    <tr>
      <td align="center" style="padding:48px 16px 0;">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Logotyp / Marka -->
          <tr>
            <td style="padding-bottom:40px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:15px;font-weight:400;letter-spacing:0.12em;color:#A19D95;text-transform:uppercase;">
                Nobile Pet Care
              </p>
            </td>
          </tr>

          <!-- Kreska terracotta -->
          <tr>
            <td style="padding-bottom:32px;">
              <div style="width:40px;height:2px;background-color:#B8654A;"></div>
            </td>
          </tr>

          <!-- Nagłówek -->
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:36px;font-weight:400;line-height:1.15;color:#2A2A28;">
                Dostaliśmy<br/>Twoją wiadomość.
              </h1>
            </td>
          </tr>

          <!-- Treść -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#6B6862;">
                Cześć ${escHtml(name)},
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#6B6862;">
                Twoja wiadomość w temacie
                <span style="color:#2A2A28;font-weight:500;">${escHtml(subjectLabel)}</span>
                dotarła do nas. Odezwiemy się zwykle tego samego lub następnego dnia roboczego.
              </p>
            </td>
          </tr>

          <!-- Separator -->
          <tr>
            <td style="padding-bottom:32px;">
              <div style="height:1px;background-color:#E8E2D6;"></div>
            </td>
          </tr>

          <!-- Blok warm island — obietnica -->
          <tr>
            <td style="padding-bottom:40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#F0E8DC;border-radius:16px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.08em;color:#A19D95;text-transform:uppercase;">
                      Nasza obietnica
                    </p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#6B6862;">
                      Jeśli Twój pupil nie polubił produktu — zwracamy pieniądze.<br/>
                      14 dni, bez uzasadnienia.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom:48px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#B8654A;border-radius:12px;">
                    <a href="https://nobilepetcare.pl/produkty"
                      style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:500;color:#FDFBF7;text-decoration:none;border-radius:12px;">
                      Przeglądaj produkty
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Stopka -->
          <tr>
            <td style="border-top:1px solid #E8E2D6;padding-top:28px;padding-bottom:48px;">
              <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#A19D95;line-height:1.6;">
                Nobile Pet Care &nbsp;·&nbsp;
                <a href="https://nobilepetcare.pl/kontakt" style="color:#A19D95;text-decoration:underline;">kontakt@nobilepetcare.pl</a>
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#A19D95;line-height:1.6;">
                Otrzymujesz ten e-mail, ponieważ wypełniłeś/-aś formularz kontaktowy.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

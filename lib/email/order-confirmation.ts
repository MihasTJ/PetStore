export interface OrderEmailData {
  orderNumber: string;
  firstName: string;
  petName?: string | null;
  items: { name: string; quantity: number; price_at_purchase: number }[];
  shippingCost: number;
  premiumPackaging: boolean;
  total: number;
  shippingAddress: {
    first_name: string;
    last_name: string;
    street: string;
    apt?: string | null;
    postal_code: string;
    city: string;
  };
  shippingMethod: "inpost" | "dpd";
}

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",") + " zł";
}

export function orderConfirmationHtml(d: OrderEmailData): string {
  const itemsRows = d.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E8E2D6;font-size:14px;color:#2A2A28;">
          ${item.name}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #E8E2D6;font-size:14px;color:#6B6862;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #E8E2D6;font-size:14px;color:#2A2A28;text-align:right;">
          ${fmt(item.price_at_purchase * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const packagingRow = d.premiumPackaging
    ? `<tr>
        <td colspan="2" style="padding:8px 0;font-size:13px;color:#6B6862;">Opakowanie premium</td>
        <td style="padding:8px 0;font-size:13px;color:#6B6862;text-align:right;">${fmt(19)}</td>
       </tr>`
    : "";

  const shippingLabel =
    d.shippingMethod === "inpost" ? "InPost Paczkomat" : "Kurier DPD";

  const aptLine = d.shippingAddress.apt
    ? ` m. ${d.shippingAddress.apt}`
    : "";

  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Potwierdzenie zamówienia</title>
</head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

      <!-- Header -->
      <tr><td style="background:#2A2A28;padding:32px 40px;border-radius:12px 12px 0 0;">
        <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B8654A;">
          Nobile Pet Care
        </p>
        <h1 style="margin:12px 0 0;font-size:26px;font-weight:400;color:#FAF7F2;line-height:1.3;">
          Doskonały wybór<br>dla ${d.petName ?? "Twojego pupila"}.
        </h1>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#FDFBF7;padding:36px 40px;">

        <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#B8654A;">
          Zamówienie przyjęte
        </p>
        <p style="margin:0 0 12px;font-size:15px;color:#6B6862;line-height:1.6;">
          Numer zamówienia: <strong style="color:#2A2A28;font-family:monospace;">#${d.orderNumber}</strong>
        </p>
        <p style="margin:0 0 28px;font-size:14px;color:#6B6862;line-height:1.6;">
          Skład każdego produktu w tym zamówieniu jest zweryfikowany weterynaryjnie — masz pewność co do bezpieczeństwa.
        </p>

        <!-- Items table -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <th style="padding:8px 0;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#A19D95;text-align:left;font-weight:400;">Produkt</th>
              <th style="padding:8px 0;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#A19D95;text-align:center;font-weight:400;">Szt.</th>
              <th style="padding:8px 0;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#A19D95;text-align:right;font-weight:400;">Kwota</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
            ${packagingRow}
            <tr>
              <td colspan="2" style="padding:8px 0;font-size:13px;color:#6B6862;">${shippingLabel}</td>
              <td style="padding:8px 0;font-size:13px;color:#6B6862;text-align:right;">${fmt(d.shippingCost)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:14px 0 0;font-size:15px;font-weight:600;color:#2A2A28;border-top:2px solid #E8E2D6;">Łącznie</td>
              <td style="padding:14px 0 0;font-size:15px;font-weight:600;color:#2A2A28;text-align:right;border-top:2px solid #E8E2D6;">${fmt(d.total)}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Shipping address -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
          <tr>
            <td style="background:#FAF7F2;border-radius:8px;padding:20px 24px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#A19D95;">Adres dostawy</p>
              <p style="margin:0;font-size:14px;color:#2A2A28;line-height:1.7;">
                ${d.shippingAddress.first_name} ${d.shippingAddress.last_name}<br>
                ${d.shippingAddress.street}${aptLine}<br>
                ${d.shippingAddress.postal_code} ${d.shippingAddress.city}<br>
                <span style="color:#6B6862;">${shippingLabel}</span>
              </p>
            </td>
          </tr>
        </table>

        <!-- Health report note -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
          <tr>
            <td style="background:#F0E8DC;border-radius:8px;padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#3D4F3D;font-weight:500;">Raport zdrowotny</p>
              <p style="margin:0;font-size:13px;color:#2A2A28;line-height:1.6;">
                Jutro rano trafi na Twoją skrzynkę szczegółowy plan suplementacji i wskazówki zdrowotne dla Twojego pupila.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:28px 0 0;font-size:13px;color:#A19D95;line-height:1.6;">
          Masz 30 dni na zwrot — bez pytań, bez uzasadnienia. Jeśli Twój pupil nie zaakceptuje produktu, zwracamy pełną kwotę.
        </p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#FAF7F2;padding:24px 40px;border-radius:0 0 12px 12px;border-top:1px solid #E8E2D6;">
        <p style="margin:0;font-size:12px;color:#A19D95;line-height:1.6;">
          Nobile Pet Care &nbsp;·&nbsp; kontakt@nobilepetcare.pl<br>
          Ta wiadomość została wygenerowana automatycznie — prosimy na nią nie odpowiadać.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function orderConfirmationText(d: OrderEmailData): string {
  const itemLines = d.items
    .map((i) => `  ${i.name} x ${i.quantity}  ${fmt(i.price_at_purchase * i.quantity)}`)
    .join("\n");

  const shippingLabel =
    d.shippingMethod === "inpost" ? "InPost Paczkomat" : "Kurier DPD";

  return `Nobile Pet Care — zamówienie #${d.orderNumber}

Doskonały wybór dla ${d.petName ?? "Twojego pupila"}.

Skład każdego produktu jest zweryfikowany weterynaryjnie — masz pewność co do bezpieczeństwa.

PRODUKTY
${itemLines}
${d.premiumPackaging ? `  Opakowanie premium  ${fmt(19)}\n` : ""}  ${shippingLabel}  ${fmt(d.shippingCost)}
---
Łącznie: ${fmt(d.total)}

ADRES DOSTAWY
${d.shippingAddress.first_name} ${d.shippingAddress.last_name}
${d.shippingAddress.street}${d.shippingAddress.apt ? ` m. ${d.shippingAddress.apt}` : ""}
${d.shippingAddress.postal_code} ${d.shippingAddress.city}
Dostawa: ${shippingLabel}

RAPORT ZDROWOTNY
Jutro rano trafi na Twoją skrzynkę szczegółowy plan suplementacji i wskazówki zdrowotne dla Twojego pupila.

Masz 30 dni na zwrot — bez pytań, bez uzasadnienia.
Jeśli Twój pupil nie zaakceptuje produktu, zwracamy pełną kwotę.
`;
}

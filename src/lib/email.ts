import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpEmail(to: string, otp: string, name: string) {
  const resend = getResend();
  await resend.emails.send({
    from: "Dev Dojo <onboarding@resend.dev>",
    to,
    subject: "Codigo de recuperacion — Dev Dojo",
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px">
        <div style="text-align:center;margin-bottom:32px">
          <div style="display:inline-block;background:#94E2D5;color:#1E1E2E;font-weight:800;font-size:18px;padding:8px 16px;border-radius:10px">&lt;/&gt; Dev Dojo</div>
        </div>
        <h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 8px">Recuperacion de contrasena</h2>
        <p style="font-size:14px;color:#64748b;margin:0 0 24px;line-height:1.6">
          Hola <strong>${name}</strong>, recibimos una solicitud para restablecer tu contrasena. Usa el siguiente codigo:
        </p>
        <div style="background:#f1f5f9;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
          <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#0f172a;font-family:monospace">${otp}</div>
        </div>
        <p style="font-size:13px;color:#94a3b8;margin:0 0 8px;line-height:1.5">
          Este codigo expira en <strong>10 minutos</strong>.
        </p>
        <p style="font-size:13px;color:#94a3b8;margin:0;line-height:1.5">
          Si no solicitaste este cambio, puedes ignorar este correo.
        </p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px" />
        <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0">
          Dev Dojo — Plataforma de aprendizaje de desarrollo web
        </p>
      </div>
    `,
  });
}

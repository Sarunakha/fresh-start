import nodemailer from "nodemailer";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export function getAppUrl() {
  const explicit = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit;

  // Vercel sets VERCEL_URL without protocol (e.g. "my-app.vercel.app").
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export function getMailFrom() {
  return (
    process.env.SMTP_FROM ??
    process.env.EMAIL_FROM ??
    (process.env.EMAIL_USER ? `Fresh Start <${process.env.EMAIL_USER}>` : "Fresh Start <no-reply@freshstart.local>")
  );
}

export function getTransport() {
  // Prefer explicit SMTP_* (supports any provider), fallback to Gmail with EMAIL_USER/EMAIL_PASS.
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? "465");
  const user = process.env.SMTP_USER ?? process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS ?? process.env.EMAIL_PASS;

  if (!user) throw new Error("SMTP_USER or EMAIL_USER is not set");
  if (!pass) throw new Error("SMTP_PASS or EMAIL_PASS is not set");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

export function buildResetEmailHtml(opts: {
  resetUrl: string;
  expiresInHours: number;
}) {
  const { resetUrl, expiresInHours } = opts;
  const buttonBg = "#0A1922";
  const accent = "#99F6E4";

  return `
  <div style="background:#f8fafc;padding:32px 12px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(2,6,23,0.08);border-radius:20px;overflow:hidden;">
      <div style="padding:22px 24px;background:linear-gradient(135deg,#020617 0%,#0A1922 45%,#0f172a 100%);">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="cid:fsc-logo" alt="Fresh Start Facility Solutions" width="140" style="display:block;filter:drop-shadow(0 10px 25px rgba(0,0,0,0.25));" />
          <div style="color:rgba(255,255,255,0.82);font-size:12px;letter-spacing:0.18em;font-weight:700;">
            ADMIN PORTAL
          </div>
        </div>
        <div style="margin-top:14px;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.01em;">
          Reset your password
        </div>
        <div style="margin-top:6px;color:rgba(255,255,255,0.72);font-size:13px;line-height:1.55;">
          A password reset was requested for your Fresh Start admin account.
        </div>
      </div>

      <div style="padding:22px 24px;">
        <p style="margin:0 0 16px;color:#0f172a;font-size:14px;line-height:1.65;">
          Click the button below to set a new password. This link expires in <strong>${expiresInHours} hour</strong>.
        </p>

        <p style="margin:0 0 18px;">
          <a href="${resetUrl}" style="display:inline-block;background:${buttonBg};color:${accent};padding:12px 16px;border-radius:12px;text-decoration:none;font-weight:800;font-size:14px;letter-spacing:0.01em;">
            Reset Password
          </a>
        </p>

        <div style="padding:14px 14px;border:1px solid rgba(2,6,23,0.08);border-radius:14px;background:#f8fafc;">
          <div style="color:#0f172a;font-size:12px;font-weight:800;letter-spacing:0.12em;">
            SECURITY NOTE
          </div>
          <div style="margin-top:6px;color:rgba(15,23,42,0.72);font-size:12px;line-height:1.6;">
            If you didn’t request a reset, you can safely ignore this email. Your password won’t change unless you use the link above.
          </div>
        </div>

        <p style="margin:16px 0 0;color:rgba(15,23,42,0.55);font-size:11px;line-height:1.6;">
          If the button doesn’t work, copy and paste this URL into your browser:<br />
          <span style="word-break:break-all;">${resetUrl}</span>
        </p>
      </div>

      <div style="padding:16px 24px;border-top:1px solid rgba(2,6,23,0.06);color:rgba(15,23,42,0.55);font-size:11px;">
        © ${new Date().getFullYear()} Fresh Start Facility Solutions Sydney
      </div>
    </div>
  </div>`;
}


import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = `${process.env.NEWSLETTER_FROM_NAME ?? 'HTAG'} <${process.env.NEWSLETTER_FROM_EMAIL ?? 'noreply@hoffmantag.org'}>`;
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function sendNewsletter(opts: {
  to: string;
  subject: string;
  bodyHtml: string;
  unsubscribeToken: string;
}) {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping send to', opts.to);
    return { skipped: true };
  }
  const unsubUrl = `${SITE}/api/newsletter/unsubscribe?token=${opts.unsubscribeToken}`;
  const html = `${opts.bodyHtml}
    <hr style="margin:40px 0;border:none;border-top:1px solid #e5e1d4" />
    <p style="font-size:12px;color:#7d756a;font-family:sans-serif">
      You're receiving this because you subscribed to HTAG updates.<br/>
      <a href="${unsubUrl}" style="color:#e07a5f">Unsubscribe</a>
    </p>`;
  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    html,
    headers: { 'List-Unsubscribe': `<${unsubUrl}>` },
  });
}

export async function sendVerifyEmail(to: string, verifyToken: string) {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — verify link:', `${SITE}/api/newsletter/verify?token=${verifyToken}`);
    return { skipped: true };
  }
  const verifyUrl = `${SITE}/api/newsletter/verify?token=${verifyToken}`;
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Confirm your HTAG newsletter subscription',
    html: `
      <p>Thanks for subscribing to the Hoffman Tenants Advocacy Group newsletter.</p>
      <p>Click the link below to confirm your email:</p>
      <p><a href="${verifyUrl}" style="background:#e07a5f;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;display:inline-block">Confirm subscription</a></p>
    `,
  });
}

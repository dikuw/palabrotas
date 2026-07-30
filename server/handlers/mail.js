import postmark from 'postmark';

function getClient() {
  if (!process.env.POSTMARK_SERVER_TOKEN) {
    throw new Error('POSTMARK_SERVER_TOKEN is not configured');
  }
  if (!process.env.POSTMARK_FROM_EMAIL) {
    throw new Error('POSTMARK_FROM_EMAIL is not configured');
  }
  return {
    client: new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN),
    from: process.env.POSTMARK_FROM_EMAIL,
  };
}

export async function sendEmail({ to, subject, textBody, htmlBody }) {
  const { client, from } = getClient();
  return client.sendEmail({
    From: from,
    To: to,
    Subject: subject,
    TextBody: textBody,
    HtmlBody: htmlBody,
    MessageStream: 'outbound',
  });
}

export function getFrontendUrl() {
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL.replace(/\/$/, '');
  }
  return process.env.ENV === 'production'
    ? 'https://www.palabrotas.app'
    : 'http://localhost:3000';
}

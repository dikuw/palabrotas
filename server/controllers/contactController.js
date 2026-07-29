import postmark from 'postmark';

const CONTACT_TO_EMAIL = 'michael@dikuw.com';

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!process.env.POSTMARK_SERVER_TOKEN) {
      console.error('POSTMARK_SERVER_TOKEN is not configured');
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured.',
      });
    }

    const fromEmail = process.env.POSTMARK_FROM_EMAIL;
    if (!fromEmail) {
      console.error('POSTMARK_FROM_EMAIL is not configured');
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured.',
      });
    }

    const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);
    const safeName = name.trim();
    const safeEmail = email.trim();
    const safeMessage = message.trim();

    await client.sendEmail({
      From: fromEmail,
      To: CONTACT_TO_EMAIL,
      ReplyTo: safeEmail,
      Subject: `Palabrotas contact form: ${safeName}`,
      TextBody: [
        `Name: ${safeName}`,
        `Email: ${safeEmail}`,
        '',
        safeMessage,
      ].join('\n'),
      HtmlBody: `
        <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(safeMessage).replace(/\n/g, '<br>')}</p>
      `,
      MessageStream: 'outbound',
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully.',
    });
  } catch (error) {
    console.error('Error sending contact message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

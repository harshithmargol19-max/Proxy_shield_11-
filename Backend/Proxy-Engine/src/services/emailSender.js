import { createEmailTransporter } from '../config/email.js';

export const sendEmail = async (options) => {
  const transporter = createEmailTransporter();

  const mailOptions = {
    from: options.from || process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendBulkEmails = async (recipients, options) => {
  const results = [];

  for (const recipient of recipients) {
    try {
      const result = await sendEmail({
        ...options,
        to: recipient,
      });
      results.push({ recipient, success: true, ...result });
    } catch (error) {
      results.push({ recipient, success: false, error: error.message });
    }
  }

  return results;
};

export const sendFraudAlert = async (to, emailData, fraudScore) => {
  return sendEmail({
    to,
    subject: 'Security Alert: Suspicious Email Detected',
    text: `
A suspicious email has been detected and blocked.

Details:
- From: ${emailData.from}
- To: ${emailData.to}
- Subject: ${emailData.subject}
- Fraud Score: ${fraudScore}

If you believe this was a mistake, please contact support.
    `.trim(),
    html: `
<h2>Security Alert: Suspicious Email Detected</h2>
<p>A suspicious email has been detected and blocked.</p>
<table>
  <tr><td><strong>From:</strong></td><td>${emailData.from}</td></tr>
  <tr><td><strong>To:</strong></td><td>${emailData.to}</td></tr>
  <tr><td><strong>Subject:</strong></td><td>${emailData.subject}</td></tr>
  <tr><td><strong>Fraud Score:</strong></td><td>${fraudScore}</td></tr>
</table>
<p>If you believe this was a mistake, please contact support.</p>
    `.trim(),
  });
};

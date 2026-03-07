import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import Email from '../models/Email.js';
import { analyzeEmailForFraud } from './fraudAnalysis.js';
import { routeEmailToUser } from './emailRouter.js';

const startSMTPServer = (port = 2525) => {
  const server = new SMTPServer({
    onData(stream, session, callback) {
      let rawEmail = '';

      stream.on('data', (chunk) => {
        rawEmail += chunk.toString();
      });

      stream.on('end', async () => {
        try {
          const parsed = await simpleParser(rawEmail);

          const emailData = {
            messageId: parsed.messageId || '',
            from: parsed.from?.value?.[0]?.address || parsed.from?.text || '',
            to: parsed.to?.value?.[0]?.address || parsed.to?.text || '',
            subject: parsed.subject || '',
            text: parsed.text || '',
            html: parsed.html || '',
            headers: Object.fromEntries(parsed.headers),
            attachments: parsed.attachments?.map(att => ({
              filename: att.filename,
              contentType: att.contentType,
              size: att.size,
            })) || [],
            receivedAt: new Date(),
          };

          const analysis = await analyzeEmailForFraud(emailData);
          emailData.fraudScore = analysis.score;
          emailData.fraudFlags = analysis.flags;
          emailData.isFraudulent = analysis.isFraudulent;
          emailData.analyzedAt = new Date();

          const email = new Email(emailData);
          const savedEmail = await email.save();

          console.log(`Email received from ${emailData.from} to ${emailData.to}`);
          console.log(`Fraud Score: ${analysis.score}, Flags: ${analysis.flags.join(', ')}`);

          if (!analysis.isFraudulent) {
            try {
              const routeResult = await routeEmailToUser(emailData);

              if (routeResult.success) {
                await Email.findByIdAndUpdate(savedEmail._id, { 
                  delivered: true,
                  proxyEmail: emailData.to,
                  realEmail: routeResult.realEmail,
                  userId: routeResult.userId,
                  shieldIdentityId: routeResult.shieldIdentityId
                });
                console.log(`Email forwarded from ${emailData.to} to ${routeResult.realEmail}`);
              } else {
                console.log(`Email routing failed: ${routeResult.message}`);
                await Email.findByIdAndUpdate(savedEmail._id, { 
                  deliveryError: routeResult.message
                });
              }
            } catch (sendError) {
              console.error('Error delivering email:', sendError);
            }
          } else {
            console.log(`Fraudulent email blocked: ${analysis.flags.join(', ')}`);
          }

          callback();
        } catch (error) {
          console.error('Error processing email:', error);
          callback(error);
        }
      });
    },

    onAuth(auth, session, callback) {
      if (auth.username === process.env.SMTP_USER && auth.password === process.env.SMTP_PASS) {
        callback(null, { user: auth.username });
      } else {
        callback(new Error('Invalid credentials'));
      }
    },
  });

  server.listen(port, () => {
    console.log(`SMTP Server running on port ${port}`);
  });

  return server;
};

export { startSMTPServer };

import { simpleParser } from 'mailparser';

export const emailParser = async (req, res, next) => {
  try {
    const rawEmail = req.body.raw || req.body;

    if (rawEmail && typeof rawEmail === 'string') {
      const parsed = await simpleParser(rawEmail);
      
      req.parsedEmail = {
        from: parsed.from?.text || parsed.from?.value?.[0]?.address || '',
        to: parsed.to?.text || parsed.to?.value?.[0]?.address || '',
        subject: parsed.subject || '',
        text: parsed.text || '',
        html: parsed.html || '',
        headers: parsed.headers,
        attachments: parsed.attachments?.map(att => ({
          filename: att.filename,
          contentType: att.contentType,
          size: att.size,
        })) || [],
        messageId: parsed.messageId || '',
      };
    } else if (rawEmail && typeof rawEmail === 'object') {
      req.parsedEmail = {
        from: rawEmail.from || '',
        to: rawEmail.to || '',
        subject: rawEmail.subject || '',
        text: rawEmail.text || '',
        html: rawEmail.html || '',
        headers: rawEmail.headers || {},
        attachments: rawEmail.attachments || [],
        messageId: rawEmail.messageId || '',
      };
    }

    next();
  } catch (error) {
    console.error('Email parsing error:', error);
    next(error);
  }
};

export const extractEmailHeaders = (headers) => {
  const headerMap = new Map();
  
  if (headers && typeof headers === 'object') {
    headers.forEach((value, key) => {
      headerMap.set(key.toLowerCase(), value);
    });
  }
  
  return {
    get: (key) => headerMap.get(key.toLowerCase()),
    has: (key) => headerMap.has(key.toLowerCase()),
    all: Object.fromEntries(headerMap),
  };
};

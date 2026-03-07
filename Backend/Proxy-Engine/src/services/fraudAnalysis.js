const PHISHING_KEYWORDS = [
  'verify your account',
  'update your payment',
  'confirm your identity',
  'urgent action required',
  'account suspended',
  'click here to login',
  'password expiration',
  'security alert',
  'unauthorized access',
  'suspicious activity',
];

const SUSPICIOUS_DOMAINS = [
  'tempmail.com',
  'throwaway.email',
  'fakeinbox.com',
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'fake-email.com',
  'dispostable.com',
];

const SUSPICIOUS_URLS = [
  'bit.ly',
  'tinyurl.com',
  'goo.gl',
  't.co',
  'ow.ly',
  'is.gd',
  'buff.ly',
];

const URGENCY_PATTERNS = [
  /immediately/i,
  /urgent/i,
  /act now/i,
  /limited time/i,
  /expire/i,
  /within 24 hours/i,
  /last chance/i,
  /don'?t wait/i,
];

const SUSPICIOUS_URL_PATTERNS = [
  /bit\.ly/i,
  /tinyurl/i,
  /goo\.gl/i,
  /t\.co/i,
  /ow\.ly/i,
  /is\.gd/i,
  /buff\.ly/i,
  /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/i,
];

export const analyzeEmailForFraud = async (emailData) => {
  const flags = [];
  let score = 0;

  const { from, to, subject, text, html } = emailData;
  const fullContent = `${subject} ${text} ${html}`.toLowerCase();

  if (from) {
    const emailRegex = /<([^>]+)>/;
    const emailMatch = from.match(emailRegex);
    const senderEmail = emailMatch ? emailMatch[1] : from;

    const senderDomain = senderEmail.split('@')[1]?.toLowerCase();

    if (senderDomain) {
      if (SUSPICIOUS_DOMAINS.some(domain => senderDomain.includes(domain))) {
        flags.push('Suspicious sender domain');
        score += 40;
      }

      if (!senderDomain.includes('.') || senderDomain.length < 5) {
        flags.push('Invalid sender domain format');
        score += 20;
      }
    }
  }

  if (to) {
    const recipientDomain = to.split('@')[1]?.toLowerCase();
    if (recipientDomain && SUSPICIOUS_DOMAINS.some(domain => recipientDomain.includes(domain))) {
      flags.push('Suspicious recipient domain');
      score += 30;
    }
  }

  for (const keyword of PHISHING_KEYWORDS) {
    if (fullContent.includes(keyword.toLowerCase())) {
      flags.push(`Phishing keyword detected: ${keyword}`);
      score += 15;
    }
  }

  for (const pattern of URGENCY_PATTERNS) {
    if (pattern.test(fullContent)) {
      flags.push('Urgency language detected');
      score += 10;
      break;
    }
  }

  for (const pattern of SUSPICIOUS_URL_PATTERNS) {
    if (pattern.test(fullContent)) {
      flags.push('Suspicious URL detected');
      score += 20;
      break;
    }
  }

  const hasHtml = html && html.length > 0;
  const hasText = text && text.length > 0;

  if (hasHtml && !hasText) {
    flags.push('HTML-only email (no plain text)');
    score += 5;
  }

  if (subject && subject.length > 100) {
    flags.push('Excessively long subject line');
    score += 5;
  }

  const linkCount = (fullContent.match(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi) || []).length;
  if (linkCount > 10) {
    flags.push(`Excessive number of links: ${linkCount}`);
    score += 15;
  }

  const hasLoginForm = /<input[^>]*type=["']password["']/i.test(html || '');
  const hasCreditCard = /<input[^>]*type=["']credit-card["']|card\s*number/i.test(html || '');
  
  if (hasLoginForm) {
    flags.push('Login form detected in email');
    score += 30;
  }
  
  if (hasCreditCard) {
    flags.push('Credit card input detected in email');
    score += 35;
  }

  const isFraudulent = score >= 50;

  return {
    score: Math.min(score, 100),
    isFraudulent,
    flags: [...new Set(flags)],
    analyzedAt: new Date(),
  };
};

export const getFraudStatistics = async () => {
  return {
    totalEmailsAnalyzed: 0,
    fraudulentEmails: 0,
    blockedEmails: 0,
    deliveredEmails: 0,
  };
};

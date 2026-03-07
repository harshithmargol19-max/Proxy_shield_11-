export const formatEmailAddress = (email) => {
  if (!email) return '';
  
  if (email.includes('<') && email.includes('>')) {
    const match = email.match(/<([^>]+)>/);
    return match ? match[1] : email;
  }
  
  return email.trim();
};

export const extractDomain = (email) => {
  const formatted = formatEmailAddress(email);
  const parts = formatted.split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : '';
};

export const parseEmailHeaders = (headers) => {
  const parsed = {};
  
  if (headers && typeof headers.forEach === 'function') {
    headers.forEach((value, key) => {
      parsed[key.toLowerCase()] = value;
    });
  } else if (typeof headers === 'object') {
    Object.keys(headers).forEach(key => {
      parsed[key.toLowerCase()] = headers[key];
    });
  }
  
  return parsed;
};

export const calculateRiskScore = (factors) => {
  const weights = {
    suspiciousDomain: 30,
    urgencyLanguage: 15,
    phishingKeywords: 20,
    suspiciousLinks: 25,
    htmlForms: 35,
    noPlainText: 5,
    excessiveLinks: 15,
  };

  let totalScore = 0;
  
  for (const [factor, active] of Object.entries(factors)) {
    if (active && weights[factor]) {
      totalScore += weights[factor];
    }
  }

  return Math.min(totalScore, 100);
};

export const generateEmailSummary = (email) => {
  return {
    id: email._id,
    from: email.from,
    to: email.to,
    subject: email.subject,
    fraudScore: email.fraudScore,
    isFraudulent: email.isFraudulent,
    receivedAt: email.receivedAt,
    delivered: email.delivered,
  };
};

export const paginateResults = (query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  return {
    limit: parseInt(limit),
    skip: parseInt(skip),
    page: parseInt(page),
  };
};

export const formatResponse = (success, data = null, message = '', pagination = null) => {
  const response = {
    success,
    ...(data && { data }),
    ...(message && { message }),
    ...(pagination && { pagination }),
    timestamp: new Date().toISOString(),
  };
  
  return response;
};

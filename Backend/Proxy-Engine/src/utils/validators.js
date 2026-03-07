import validator from 'validator';

export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }
  
  if (!validator.isEmail(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
};

export const validateEmailData = (data) => {
  const errors = [];

  if (!data.from) {
    errors.push('Sender (from) is required');
  } else if (!validator.isEmail(data.from) && !data.from.includes('@')) {
    errors.push('Invalid sender email format');
  }

  if (!data.to) {
    errors.push('Recipient (to) is required');
  } else if (!validator.isEmail(data.to) && !data.to.includes('@')) {
    errors.push('Invalid recipient email format');
  }

  if (data.subject && typeof data.subject !== 'string') {
    errors.push('Subject must be a string');
  }

  if (data.text && typeof data.text !== 'string') {
    errors.push('Text content must be a string');
  }

  if (data.html && typeof data.html !== 'string') {
    errors.push('HTML content must be a string');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateFraudReport = (data) => {
  const errors = [];

  if (!data.emailId) {
    errors.push('Email ID is required');
  }

  const validReportTypes = ['phishing', 'spam', 'malware', 'spoofing', 'other'];
  if (!data.reportType) {
    errors.push('Report type is required');
  } else if (!validReportTypes.includes(data.reportType)) {
    errors.push(`Invalid report type. Must be one of: ${validReportTypes.join(', ')}`);
  }

  if (!data.reportedBy) {
    errors.push('Reporter is required');
  }

  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (data.severity && !validSeverities.includes(data.severity)) {
    errors.push(`Invalid severity. Must be one of: ${validSeverities.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  return validator.escape(input.trim());
};

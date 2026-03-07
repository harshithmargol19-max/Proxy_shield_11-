import { analyzeEmailForFraud } from '../services/fraudAnalysis.js';

export const fraudDetector = async (req, res, next) => {
  try {
    const emailData = req.body;

    const analysis = await analyzeEmailForFraud(emailData);

    req.fraudAnalysis = analysis;

    if (analysis.isFraudulent) {
      req.isFraudulent = true;
      req.fraudScore = analysis.score;
      req.fraudFlags = analysis.flags;
    }

    next();
  } catch (error) {
    console.error('Fraud detection error:', error);
    next(error);
  }
};

export const checkFraudThreshold = (threshold = 50) => {
  return (req, res, next) => {
    const score = req.fraudAnalysis?.score || 0;

    if (score >= threshold) {
      return res.status(400).json({
        success: false,
        message: 'Email flagged as potentially fraudulent',
        fraudScore: score,
        flags: req.fraudAnalysis.flags,
      });
    }

    next();
  };
};

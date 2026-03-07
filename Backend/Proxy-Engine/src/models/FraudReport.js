import mongoose from 'mongoose';

const fraudReportSchema = new mongoose.Schema({
  emailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Email',
    required: true,
  },
  reportType: {
    type: String,
    enum: ['phishing', 'spam', 'malware', 'spoofing', 'other'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  reportedBy: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'false_positive'],
    default: 'pending',
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  indicators: [
    {
      type: String,
    },
  ],
  resolution: {
    type: String,
    default: '',
  },
  resolvedAt: {
    type: Date,
  },
  resolvedBy: {
    type: String,
  },
}, {
  timestamps: true,
});

fraudReportSchema.index({ emailId: 1 });
fraudReportSchema.index({ reportType: 1 });
fraudReportSchema.index({ status: 1 });

const FraudReport = mongoose.model('FraudReport', fraudReportSchema);

export default FraudReport;

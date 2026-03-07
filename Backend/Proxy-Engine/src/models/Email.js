import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  messageId: {
    type: String,
    unique: true,
    sparse: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  proxyEmail: {
    type: String,
  },
  realEmail: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  shieldIdentityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShieldIdentity',
  },
  subject: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  html: {
    type: String,
    default: '',
  },
  headers: {
    type: Map,
    of: String,
  },
  attachments: [
    {
      filename: String,
      contentType: String,
      size: Number,
    },
  ],
  fraudScore: {
    type: Number,
    default: 0,
  },
  fraudFlags: [
    {
      type: String,
    },
  ],
  isFraudulent: {
    type: Boolean,
    default: false,
  },
  analyzedAt: {
    type: Date,
    default: Date.now,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

emailSchema.index({ from: 1, to: 1 });
emailSchema.index({ analyzedAt: -1 });

const Email = mongoose.model('Email', emailSchema);

export default Email;

import mongoose from 'mongoose';
const { Schema } = mongoose;

const shieldIdentitySchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  proxy_email: { type: String, required: true, unique: true },
  proxy_phone: { type: String },
  browser_fingerprint: { type: String },
  website: { type: String },
  creation_time: { type: Date, default: Date.now },
  last_used: { type: Date },
  status: { type: String, enum: ['active', 'burned', 'compromised'], default: 'active' },
  linked_services: { type: [String], default: [] },
  risk_score: { type: Number, default: 0 },
  burn_reason: { type: String }
});

const ShieldIdentity = mongoose.models.ShieldIdentity || mongoose.model('ShieldIdentity', shieldIdentitySchema);

export default ShieldIdentity;

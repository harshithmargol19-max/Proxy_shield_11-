import mongoose from 'mongoose';
const { Schema } = mongoose;

const shieldIdentitySchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  proxy_email: { type: String, required: true },
  proxy_phone: { type: String },
  browser_fingerprint: { type: String },
  creation_time: { type: Date, default: Date.now },
  last_used: { type: Date },
  status: { type: String, enum: ['active', 'burned', 'compromised'], default: 'active' },
  linked_services: { type: [String], default: [] }
});

const ShieldIdentity = mongoose.model('ShieldIdentity', shieldIdentitySchema);

export default ShieldIdentity;

import mongoose from 'mongoose';
const { Schema } = mongoose;

const auditLogSchema = new Schema({
  shield_id: { type: Schema.Types.ObjectId, ref: 'ShieldIdentity', required: true },
  action: { type: String, enum: ['rotation','burn','login_attempt','communication_filtered'], required: true },
  timestamp: { type: Date, default: Date.now },
  blockchain_hash: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;

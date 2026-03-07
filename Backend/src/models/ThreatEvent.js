import mongoose from 'mongoose';
const { Schema } = mongoose;

const threatEventSchema = new Schema({
  shield_id: { type: Schema.Types.ObjectId, ref: 'ShieldIdentity', required: true },
  event_type: { type: String, enum: ['credential_leak','unauthorized_ip','phishing_attempt'], required: true },
  detected_at: { type: Date, default: Date.now },
  severity: { type: String, enum: ['low','medium','high'], default: 'medium' },
  metadata: { type: Schema.Types.Mixed } 
});

const ThreatEvent = mongoose.model('ThreatEvent', threatEventSchema);

export default ThreatEvent;

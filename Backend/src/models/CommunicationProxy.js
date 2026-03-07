import mongoose from 'mongoose';
const { Schema } = mongoose;

const communicationProxySchema = new Schema({
  shield_id: { type: Schema.Types.ObjectId, ref: 'ShieldIdentity', required: true },
  type: { type: String, enum: ['email','sms'], required: true },
  sender: { type: String },
  recipient: { type: String },
  received_at: { type: Date, default: Date.now },
  delivered_at: { type: Date },
  status: { type: String, enum: ['pending','delivered','filtered','blocked'], default: 'pending' },
  sanitized_content: { type: String }
});

const CommunicationProxy = mongoose.model('CommunicationProxy', communicationProxySchema);

export default CommunicationProxy;

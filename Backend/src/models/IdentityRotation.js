import mongoose from 'mongoose';
const { Schema } = mongoose;

const identityRotationSchema = new Schema({
  shield_id: { type: String, required: true, index: true }, // Can be ObjectId string or custom ID
  rotation_type: { type: String, enum: ['auto','manual'], required: true },
  timestamp: { type: Date, default: Date.now },
  reason: { type: String },
  new_shield_id: { type: String }, // New identity ID (ObjectId string)
  risk_score: { type: Number, default: 0 },
  ai_flags: [{ type: String }],
  blockchain_hash: { type: String },
});

const IdentityRotation = mongoose.model('IdentityRotation', identityRotationSchema);

export default IdentityRotation;

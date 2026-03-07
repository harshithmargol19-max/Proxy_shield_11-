import mongoose from 'mongoose';
const { Schema } = mongoose;

const identityRotationSchema = new Schema({
  shield_id: { type: Schema.Types.ObjectId, ref: 'ShieldIdentity', required: true },
  rotation_type: { type: String, enum: ['auto','manual'], required: true },
  timestamp: { type: Date, default: Date.now },
  reason: { type: String },
  new_shield_id: { type: Schema.Types.ObjectId, ref: 'ShieldIdentity' }
});

const IdentityRotation = mongoose.model('IdentityRotation', identityRotationSchema);

export default IdentityRotation;

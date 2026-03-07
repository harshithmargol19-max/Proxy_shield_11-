import mongoose from 'mongoose';
const { Schema } = mongoose;

const aiEngineLogSchema = new Schema({
  shield_id: { type: Schema.Types.ObjectId, ref: 'ShieldIdentity' },
  action: { type: String },
  confidence: { type: Number },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed }
});


const AIEngineLog = mongoose.model('AIEngineLog', aiEngineLogSchema);

export default AIEngineLog;

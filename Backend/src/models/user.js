import mongoose from 'mongoose';
const { Schema } = mongoose;

const deviceSchema = new Schema({
  device_id: { type: String, required: true },
  device_name: { type: String },
  device_type: { type: String, enum: ['desktop','mobile','tablet','other'], default: 'other' },
  last_active: { type: Date, default: Date.now },
  push_token: { type: String }
});

const userSchema = new Schema({
  firebase_uid: { type: String, required: true, unique: true }, 
  real_email: { type: String, required: true },  
  real_phone: { type: String },                  
  devices: { type: [deviceSchema], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  last_login: { type: Date },
  status: { type: String, enum: ['active','suspended','deleted'], default: 'active' }
});

const User = mongoose.model('User', userSchema);

export default User;

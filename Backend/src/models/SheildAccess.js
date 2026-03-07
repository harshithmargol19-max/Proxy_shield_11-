
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const SheildAccessSchema = new Schema({
    shield_id: {
        type: String,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    ip_address: {
        type: String,
        required: true
    },
    ip_country: {
        type: String,
        required: true
    },
    device_type: {
        type: String,
        enum: ['mobile', 'desktop', 'tablet', 'other'],
        required: true
    },
    browser: {
        type: String,
        required: true
    },
    os: {
        type: String,
        required: true
    },
    login_hour: {
        type: Number,
        min: 0,
        max: 23,
        required: true
    },
    request_frequency: {
        type: Number,
        default: 0
    },
    is_proxy: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const SheildAccess = model('SheildAccess', SheildAccessSchema);

export default SheildAccess;
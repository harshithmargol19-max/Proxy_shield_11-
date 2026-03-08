
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const SheildAccessSchema = new Schema({
    shield_id: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ip_address: {
        type: String,
        required: true
    },
    ip_country: {
        type: String,
        default: 'Unknown'
    },
    geo_location: {
        country: String,
        city: String,
        lat: Number,
        lng: Number
    },
    user_agent: {
        type: String
    },
    device_id: {
        type: String
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
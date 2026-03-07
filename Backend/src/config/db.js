import mongoose from 'mongoose';
import dotenv from "dotenv";

let isConnected = false;

const connectDB = async () => {
  try {
    dotenv.config();
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.warn('[MongoDB] MONGODB_URI not set - database features will not work');
      return false;
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if no MongoDB
    });
    
    isConnected = true;
    console.log('[MongoDB] Connected successfully');
    return true;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message);
    console.warn('[MongoDB] Server will continue without database - API calls requiring DB will fail');
    isConnected = false;
    return false;
  }
};

export const isDbConnected = () => isConnected;

export default connectDB;

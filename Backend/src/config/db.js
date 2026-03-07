import mongoose from 'mongoose';
import dotenv from "dotenv";

const connectDB = async () => {
  try {
    dotenv.config();
    const mongoURI = process.env.MONGODB_URI
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;

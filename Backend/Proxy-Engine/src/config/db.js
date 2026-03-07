import mongoose from 'mongoose';
import dotenv from "dotenv";

const connectDB = async () => {
  try {
    dotenv.config();
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

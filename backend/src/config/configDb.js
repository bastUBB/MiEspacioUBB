import mongoose from "mongoose";
import { MONGO_URI } from './configEnv.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`[MONGODB] ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MONGODB] Error: ${error.message}`);
    process.exit(1);
  }
};

import mongoose from "mongoose";
import { MONGO_URI, MONGO_URI_TEST } from './configEnv.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`[MONGODB] ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MONGODB] Error: ${error.message}`);
    process.exit(1);
  }
};

export const connectDbTest = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI_TEST);
    console.log(`[MONGODB_TEST] ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MONGODB_TEST] Error: ${error.message}`);
    process.exit(1);
  }
};

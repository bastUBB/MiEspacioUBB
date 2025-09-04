import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar .env desde la carpeta actual
dotenv.config({ path: 'src/config/.env' });

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

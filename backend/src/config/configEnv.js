import dotenv from "dotenv";

dotenv.config({ path: 'src/config/.env' });

// Configuración MONGODB
export const MONGO_URI = process.env.MONGO_URI;

// Configuración MinIO
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
export const MINIO_PORT = process.env.MINIO_PORT;
export const MINIO_USE_SSL = process.env.MINIO_USE_SSL;
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
export const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME;
export const SIGNED_URL_EXPIRY = process.env.SIGNED_URL_EXPIRY;
export const JWT_SECRET = process.env.JWT_SECRET;

// Configuración de Email
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// URL del Frontend
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
import dotenv from "dotenv";

dotenv.config({ path: 'src/config/.env' });

export const MONGO_URI = process.env.MONGO_URI;
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
export const MINIO_PORT = process.env.MINIO_PORT;
export const MINIO_USE_SSL = process.env.MINIO_USE_SSL;
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
export const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME;
export const SIGNED_URL_EXPIRY = process.env.SIGNED_URL_EXPIRY;
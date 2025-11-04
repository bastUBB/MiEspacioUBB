import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { connectDB } from '../config/configDb.js';

export const connectDbTest = async () => {
  beforeAll(async () => {
    await connectDB();
  });
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
}

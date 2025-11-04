import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { connectDbTest } from '../config/configDb.js';

export const connectDbTest = async () => {
  beforeAll(async () => {
    await connectDbTest();
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

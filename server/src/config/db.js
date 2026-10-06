import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  try {
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB');
      return;
    }

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export const closeDatabase = async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }

  await mongoose.connection.close();
};

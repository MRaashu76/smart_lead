import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../models/User';

export const connectDB = async (): Promise<void> => {
  let mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (err) {
      console.log('⚠️ Local MongoDB not found, falling back to In-Memory MongoDB for demo...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`✅ In-Memory MongoDB Connected: ${mongoUri}`);
    }

    const demoUser = await User.findOne({ email: 'demo@smartleads.com' });
    if (!demoUser) {
      await User.create({
        name: 'Demo Admin',
        email: 'demo@smartleads.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('✅ Demo user seeded: demo@smartleads.com / password123');
    }

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

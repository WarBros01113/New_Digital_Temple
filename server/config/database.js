import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Enable debugging and prevent command buffering
mongoose.set('debug', true);
mongoose.set('bufferCommands', false);

// Add connection event listeners
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB Error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
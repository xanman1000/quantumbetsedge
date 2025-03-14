import mongoose from 'mongoose';
import { logger } from './logger.config';

// Connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://api:GQ7NOQ0aZgIhSIrZ@quantumbets.txq2kgw.mongodb.net/?retryWrites=true&w=majority';

// Database connection options
const options = {
  autoIndex: true, // Build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

/**
 * Connect to MongoDB
 */
export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGODB_URI, options);
    logger.info(`MongoDB connected: ${connection.connection.host}`);
    
    // Set up error handling after initial connection
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
    
    return connection;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error(`Error disconnecting from MongoDB: ${error}`);
  }
}; 
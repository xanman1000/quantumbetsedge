import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/admin.model';

// Load environment variables
dotenv.config();

/**
 * Script to create an initial admin user
 * Run with: npx ts-node src/scripts/seed-admin.ts
 */
const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quantumbets');
    console.log('Connected to MongoDB');

    // Check if an admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log('Admin user already exists. Skipping seed process.');
      await mongoose.disconnect();
      return;
    }

    // Create default admin user
    const defaultAdmin = new Admin({
      email: 'admin@quantumbets.com',
      password: 'Admin123!', // This will be hashed by the pre-save hook
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
    });

    await defaultAdmin.save();
    console.log('Default admin user created successfully:');
    console.log('Email: admin@quantumbets.com');
    console.log('Password: Admin123!');
    console.log('Please change this password after first login');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin(); 
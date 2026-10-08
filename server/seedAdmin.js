import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Creating admin user...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin123@gmail.com' });

    if (existingAdmin) {
      console.log('❌ Admin user already exists with email: admin123@gmail.com');
      console.log('Deleting existing admin and creating new one...');
      await User.deleteOne({ email: 'admin123@gmail.com' });
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin123@gmail.com',
      password: 'admin123',
      role: 'admin',
      phone: '9999999999',
      address: {
        city: 'New York',
        state: 'NY',
        country: 'USA'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin123@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can now login with these credentials!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

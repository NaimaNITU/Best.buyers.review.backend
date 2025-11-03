const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function createAdminUser() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'naimaa2it@gmail.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('1234', 12);
    
    const adminUser = new User({
      name: 'Admin',
      email: 'naimaa2it@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: naimaa2it@gmail.com');
    console.log('Password: 1234');
    console.log('Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
  }
}

createAdminUser();
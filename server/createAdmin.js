require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@campuslearn.com' });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
            
            // Update to ensure it's an admin
            existingAdmin.role = 'admin';
            existingAdmin.isApproved = true;
            existingAdmin.status = 'active';
            await existingAdmin.save();
            
            console.log('Admin user updated');
        } else {
            // Create new admin user
            const adminUser = new User({
                fullName: 'System Administrator',
                email: 'admin@campuslearn.com',
                password: 'admin123', // Will be hashed by the model
                phone: '0000000000',
                role: 'admin',
                isApproved: true,
                status: 'active'
            });

            await adminUser.save();
            console.log('Admin user created successfully!');
            console.log('Email: admin@campuslearn.com');
            console.log('Password: admin123');
            console.log(' Please change the password after first login!');
        }

        await mongoose.disconnect();
        console.log('Done!');
        
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
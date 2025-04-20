const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function setupAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stem_school', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Create admin user
        const adminUser = new User({
            username: 'admin',
            password: 'STEMBNS@2025',
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: STEMBNS@2025');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
    }
}

setupAdmin(); 
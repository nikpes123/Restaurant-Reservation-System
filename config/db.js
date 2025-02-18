const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log('✅ MongoDB Connected...');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

import { connect } from 'mongoose';
import { config } from 'dotenv';

config(); // Load environment variables

const connectDB = async () => {
    try {
        await connect(process.env.DB_CONNECTION_STRING);
        console.log('✅ MongoDB Connected...');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

export default connectDB;

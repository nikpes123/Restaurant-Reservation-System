import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import authRoutes from '../routes/auth.js';
import restaurantRoutes from '../routes/restaurant.js';
import reservationRoutes from '../routes/reservation.js';

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://192.168.56.1:3000',
  credentials: true
}));
app.use(express.json()); // ✅ Use express.json() instead of `json()`

// Connect Database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant Reservation System!');
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes); // ✅ Required for reservations API

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

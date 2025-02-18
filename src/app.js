const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('../config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant Reservation System!');
});

const authRoutes = require('../routes/auth');
app.use('/api/auth', authRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

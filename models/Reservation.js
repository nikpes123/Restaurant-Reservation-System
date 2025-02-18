const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    name: String,
    date: Date,
    seats: Number,
    specialRequests: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', reservationSchema);

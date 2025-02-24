import { Schema, model } from 'mongoose';

const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to the user making the reservation
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',  // Reference to the restaurant
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    },
    specialRequests: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('Reservation', reservationSchema);

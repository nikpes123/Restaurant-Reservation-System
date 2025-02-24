import { Schema, model } from 'mongoose';

const RestaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Links to the user who owns the restaurant
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
    },
    address: {
        street: String,
        city: String,
        country: String
    },
    menu: [
        {
            name: String,
            description: String,
            price: Number
        }
    ],
    tables: [
        {
            tableNumber: Number,
            seats: Number,
            status: {
                type: String,
                enum: ['Available', 'Reserved'],
                default: 'Available'
            }
        }
    ],
    ratings: {
        type: Number,
        default: 0
    },
    discounts: [
        {
            description: String,
            percentage: Number,
            expiryDate: Date
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('Restaurant', RestaurantSchema);

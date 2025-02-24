// import roleMiddleware from '../middleware/roleMiddleware';

// router.post('/protected-route', roleMiddleware('Admin'), (req, res) => {
//     // Only an Admin can access this route
//     res.send('Welcome Admin!');
// });
import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import Reservation from '../models/Reservation.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

// 📌 Create a Reservation (Customer Only)
router.post(
    '/',
    [
        authMiddleware,
        roleMiddleware('Customer'),
        check('restaurant', 'Restaurant ID is required').not().isEmpty(),
        check('date', 'Date is required').not().isEmpty(),
        check('time', 'Time is required').not().isEmpty(),
        check('seats', 'Number of seats is required').isInt({ min: 1 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { restaurant, date, time, seats, specialRequests } = req.body;
            const reservation = new Reservation({
                user: req.user.id,
                restaurant,
                date,
                time,
                seats,
                specialRequests
            });

            await reservation.save();
            res.status(201).json({ msg: 'Reservation created', reservation });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// 📌 Get All Reservations for a Customer
router.get('/my-reservations', authMiddleware, roleMiddleware('Customer'), async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user.id }).populate('restaurant');
        res.json(reservations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 📌 Restaurant can Approve or Reject Reservations
router.put('/update-status/:id', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Confirmed', 'Cancelled'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        let reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ msg: 'Reservation not found' });
        }

        reservation.status = status;
        await reservation.save();
        res.json({ msg: `Reservation ${status}`, reservation });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 📌 Delete Reservation (Customer Only)
router.delete('/:id', authMiddleware, roleMiddleware('Customer'), async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ msg: 'Reservation not found' });
        }

        if (reservation.user.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        await reservation.deleteOne();
        res.json({ msg: 'Reservation deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;

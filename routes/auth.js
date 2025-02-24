import { Router } from 'express';
import { genSalt, hash, compare } from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import User from '../models/User.js'; // ✅ Ensure `.js` is added
import jwt from 'jsonwebtoken';
import Restaurant from '../models/Restaurant.js'; // Import Restaurant model
const router = Router();

// ✅ Sign Up Route
router.post('/signup', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['Admin', 'Customer', 'Restaurant'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
        // ✅ Fix: Use User.findOne() instead of findOne()
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role
        });

        // Hash password before saving
        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        await user.save();

        // ✅ If the user is a Restaurant, create an empty restaurant entry
        if (role === 'Restaurant') {
            const restaurant = new Restaurant({
                name: `Restaurant of ${name}`, // Placeholder name
                owner: user._id, // Link to the restaurant owner
                email: email // Use the same email initially
            });

            await restaurant.save();
        }

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ✅ Login Route
router.post('/login', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // ✅ Fix: Use User.findOne() instead of findOne()
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: { 
                id: user.id,
                role: user.role,
            } 
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;

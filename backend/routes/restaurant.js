import { Router } from 'express';
import Restaurant from '../models/Restaurant.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import Reservation from '../models/Reservation.js';
import User from '../models/User.js';
import { genSalt, hash, compare } from 'bcryptjs';
import multer from 'multer';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 Register a restaurant (Only Restaurants can register)
router.post('/', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    const { name, email, phone, address, menu, tables, currency } = req.body;
    
    try {
        let restaurant = await Restaurant.findOne({ email });
        if (restaurant) {
            return res.status(400).json({ msg: 'Restaurant already exists' });
        }

        restaurant = new Restaurant({
            name,
            owner: req.user.id, // Assign the logged-in restaurant owner
            email,
            phone,
            address,
            menu,
            tables,
            currency: currency || 'USD' // Add currency with default
        });

        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 📌 Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 📌 Dashboard: Get restaurant info, menu, and reservations for the logged-in owner
router.get('/dashboard', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    try {
        // Find the restaurant owned by the logged-in user
        const restaurant = await Restaurant.findOne({ owner: req.user.id });
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        // Get reservations for this restaurant
        const reservations = await Reservation.find({ restaurant: restaurant._id });

        res.json({
            restaurantInfo: {
                name: restaurant.name,
                address: restaurant.address,
                phone: restaurant.phone,
                email: restaurant.email,
                description: restaurant.description,
                openingHours: restaurant.openingHours,
                tables: restaurant.tables.length || 0,
                waitingTime: restaurant.waitingTime || 10,
                currency: restaurant.currency || 'USD',
            },
            menuItems: restaurant.menu || [],
            reservations: reservations || []
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 📌 Update restaurant details for the logged-in owner
router.put('/update', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    try {
        // Find the restaurant owned by the logged-in user
        let restaurant = await Restaurant.findOne({ owner: req.user.id });
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }
        // Update fields
        Object.assign(restaurant, req.body);
        await restaurant.save();
        res.json(restaurant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 📌 Get a single restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 📌 Update restaurant details (Only the owner can update)
router.put('/:id', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        // Ensure the logged-in user is the owner
        if (restaurant.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(restaurant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 📌 Delete a restaurant (Only the owner can delete)
router.delete('/:id', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        if (restaurant.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        await Restaurant.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Restaurant removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all menu items for the logged-in restaurant
router.get('/menu', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });
    res.json(restaurant.menu || []);
});

// Add a new menu item (with image upload)
router.post('/menu', authMiddleware, roleMiddleware('Restaurant'), upload.single('image'), async (req, res) => {
    const { name, description, price, category } = req.body;
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    const newItem = {
        name,
        description,
        price,
        category,
        image: req.file ? req.file.buffer : undefined
    };
    restaurant.menu.push(newItem);
    await restaurant.save();
    res.status(201).json(restaurant.menu);
});

// Edit a menu item (with image upload)
router.put('/menu/:itemId', authMiddleware, roleMiddleware('Restaurant'), upload.single('image'), async (req, res) => {
    const { name, description, price, category } = req.body;
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    const item = restaurant.menu.id(req.params.itemId);
    if (!item) return res.status(404).json({ msg: 'Menu item not found' });

    item.name = name;
    item.description = description;
    item.price = price;
    item.category = category;
    if (req.file) item.image = req.file.buffer;
    await restaurant.save();
    res.json(restaurant.menu);
});

// Delete a menu item
router.delete('/menu/:itemId', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    restaurant.menu.pull({ _id: req.params.itemId });
    await restaurant.save();
    res.json(restaurant.menu);
});

// Get a single menu item by ID for the logged-in restaurant
router.get('/menu/item/:itemId', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });
    const item = restaurant.menu.id(req.params.itemId);
    if (!item) return res.status(404).json({ msg: 'Menu item not found' });
    res.json(item);
});

// Change password for restaurant owner
router.post('/change-password', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New passwords do not match.' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        const isMatch = await compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });
        const salt = await genSalt(10);
        user.password = await hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password changed successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

export default router;

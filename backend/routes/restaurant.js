import { Router } from 'express';
import Restaurant from '../models/Restaurant.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

// 📌 Register a restaurant (Only Restaurants can register)
router.post('/', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    const { name, email, phone, address, menu, tables } = req.body;
    
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
            tables
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

// Add a new menu item
router.post('/menu', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    const { name, description, price } = req.body;
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    const newItem = { name, description, price };
    restaurant.menu.push(newItem);
    await restaurant.save();
    res.status(201).json(restaurant.menu);
});

// Edit a menu item
router.put('/menu/:itemId', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    const { name, description, price } = req.body;
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    const item = restaurant.menu.id(req.params.itemId);
    if (!item) return res.status(404).json({ msg: 'Menu item not found' });

    item.name = name;
    item.description = description;
    item.price = price;
    await restaurant.save();
    res.json(restaurant.menu);
});

// Delete a menu item
router.delete('/menu/:itemId', authMiddleware, roleMiddleware('Restaurant'), async (req, res) => {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    restaurant.menu.id(req.params.itemId).remove();
    await restaurant.save();
    res.json(restaurant.menu);
});

export default router;

const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant Reservation System!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
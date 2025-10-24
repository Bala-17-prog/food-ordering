// food-app-backend/index.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const passport = require('passport'); // Needed for Auth routes

require('dotenv').config();

const app = express();

// Connect to the database (You need to implement connectDB in ./db.js)
// connectDB();

// --- MIDDLEWARES (MUST be defined before routes) ---
// Enable CORS for all origins, allowing the frontend (localhost:5173) to connect
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());
// Initialize Passport for authentication strategies (like Google OAuth)
app.use(passport.initialize());

// --- ROUTES ---
// Simple test route
app.get('/', (req, res) => {
    res.send('Food Ordering App API is running!');
});

// Load and use the route modules
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/ai', require('./routes/ai')); // The Gemini AI route

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open in browser: http://localhost:${PORT}`);
});
// food-app-backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

// --- PASSPORT GOOGLE STRATEGY SETUP ---
// This strategy needs to be defined once when the router is initialized.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    try {
      let user = await User.findOne({ email });

      if (user) {
        // User already exists, log them in
        done(null, user);
      } else {
        // User doesn't exist, create a new one
        const randomPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);
        
        user = new User({
          name: profile.displayName,
          email: email,
          password: hashedPassword
        });
        await user.save();
        done(null, user);
      }
    } catch (err) {
      console.error(err);
      done(err, null);
    }
  }
));

// This is required for Passport but we won't use sessions so they are simple
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, id));

// --- GOOGLE AUTH ROUTES (This fixes the "Cannot GET" error) ---
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const payload = { user: { id: req.user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) {
                    console.error("JWT Error:", err);
                    return res.status(500).send('Authentication failed');
                }
                const userJson = JSON.stringify({ name: req.user.name, email: req.user.email });
                res.redirect(`http://localhost:5173/auth/callback?token=${token}&user=${encodeURIComponent(userJson)}`);
            }
        );
    }
);

// --- LOCAL AUTH ROUTES (Existing logic is fine) ---
// (Your /signup, /login, and /user routes)
// Note: You must have these in your file for the backend to be complete.
router.post('/signup', async (req, res) => {
    // ...
});
router.post('/login', async (req, res) => {
    // ...
});
router.get('/user', async (req, res) => {
    // ...
});

module.exports = router;
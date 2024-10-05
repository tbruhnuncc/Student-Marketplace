const express = require('express');
const controller = require('../controllers/userController');
const User = require('../models/user'); // Import the User model
const bcrypt = require('bcrypt'); // For password hashing

const router = express.Router();

// GET route for displaying the sign-up page
router.get('/register', (req, res) => {
    res.render('user/register');
});

// POST route for handling sign-up form submission
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.render('register', { error: 'Email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save(); // Save the new user to the database
        res.redirect('/login'); // Redirect to the login page after successful sign-up
    } catch (error) {
        res.render('register', { error: 'An error occurred during registration' });
    }
});

// //GET /users/new: send html form for creating a new user account
// router.get('/new', controller.new);

// //POST /users: create a new user account
// router.post('/', controller.create);

// //GET /users/login: send html for logging in
// router.get('/login', controller.getUserLogin);

// //POST /users/login: authenticate user's login
// router.post('/login', controller.login);

// //GET /users/profile: send user's profile page
// router.get('/profile', controller.profile);

// //POST /users/logout: logout a user
// router.get('/logout', controller.logout);

module.exports = router;
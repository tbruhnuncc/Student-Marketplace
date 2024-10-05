const express = require('express');
const controller = require('../controllers/userController');
const User = require('../models/user'); // Import the User model

const router = express.Router();

// GET route for displaying the sign-up page
router.get('/register', controller.register);

// POST route for handling sign-up form submission
router.post('/register', controller.create);

// //GET /users/new: send html form for creating a new user account
// router.get('/new', controller.new);

// //POST /users: create a new user account
// router.post('/', controller.create);

// //GET /users/login: send html for logging in
// router.get('/login', controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post('/login', controller.login);

//GET /users/profile: send user's profile page
router.get('/profile/:id', controller.profile);

// //POST /users/logout: logout a user
// router.get('/logout', controller.logout);

module.exports = router;
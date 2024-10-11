const express = require("express");
const controller = require("../controllers/userController");
let passport = require("passport");

const router = express.Router();

controller.googleStrategy(passport);
controller.serialization(passport);

// GET route for displaying the sign-up page
router.get("/register", controller.register);

// POST route for handling sign-up form submission
router.post("/register", controller.create);

// //GET /users/new: send html form for creating a new user account
// router.get('/new', controller.new);

// //POST /users: create a new user account
// router.post('/', controller.create);

// //GET /users/login: send html for logging in
// router.get('/login', controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post("/login", controller.login);

//GET /users/profile: send user's profile page
router.get("/profile/:id", controller.profile);

// //POST /users/logout: logout a user
// router.get('/logout', controller.logout);

// Google auth
router.get("/login/federated/google", passport.authenticate("google"));

// Google Auth redirect handling
router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;

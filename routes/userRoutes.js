const express = require("express");
const controller = require("../controllers/userController");
const { isLoggedIn, isGuest } = require("../middleware/auth");
let passport = require("passport");
const {uploadProfilePicture} = require("../middleware/fileUpload");

const router = express.Router();

controller.googleStrategy(passport);
controller.serialization(passport);

//GET /users/profile: send user's profile page
router.get("/profile", isLoggedIn, controller.profile);

router.get("/profile/:id", isLoggedIn, controller.viewSellerProfile);

router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Google auth
router.get("/login/federated/google", passport.authenticate("google"));

// Google Auth redirect handling
router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/users/profile",
    failureRedirect: "/",
    failureFlash: true,
  })
);

// profile picture upload
router.post('/uploadProfilePicture', isLoggedIn, uploadProfilePicture, controller.uploadProfilePicture);

module.exports = router;

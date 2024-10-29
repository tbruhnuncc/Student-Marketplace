const product = require("../models/product.js");
const { isLoggedIn, isGuest } = require("../middleware/auth");

exports.isGuest = (req, res, next) => {
  if (!req.session.passport || req.session.passport.user) {
    return next();
  } else {
    console.log("You are logged in already");
    req.flash("error", "You are logged in already");
    return res.redirect("/");
  }
};

exports.isLoggedIn = (req, res, next) => {
  if (req.session.passport && req.session.passport.user) {
    return next();
  } else {
    console.log("You need to log in first");
    req.flash("error", "You need to log in first");
    return res.redirect("/");
  }
};

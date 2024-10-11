const product = require("../models/product.js");

exports.isGuest = (req, res, next) => {
  console.log(req.session);
  if (!req.session.passport.user) {
    return next();
  } else {
    console.log("You are logged in already");
    //req.flash("error", "You are logged in already");
    return res.redirect("/");
  }
};

exports.isLoggedIn = (req, res, next) => {
  console.log(req.session);
  if (req.session.passport.user) {
    return next();
  } else {
    console.log("You need to log in first");
    //req.flash("error", "You need to log in first");
    return res.redirect("/users/login");
  }
};

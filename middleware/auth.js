const product = require("../models/product.js");

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

exports.isSeller = (req, res, next) => {
  let id = req.params.id;
  product
    .findById(id)
    .then((product) => {
      if (product) {
        if (product.seller.equals(req.session.passport.user.id)) {
          return next();
        } else {
          let err = new Error("Unauthorized to access the resource");
          err.status = 401;
          return next(err);
        }
      } else {
        let err = new Error("Cannot find listing with id", id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.isNotSeller = (req, res, next) => {
  let id = req.params.id;
  product
    .findById(id)
    .then((product) => {
      if (product) {
        if (!product.seller.equals(req.session.passport.user.id)) {
          return next();
        } else {
          let err = new Error("Unauthorized to access the resource");
          err.status = 401;
          return next(err);
        }
      } else {
        let err = new Error("Cannot find listing with id", id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

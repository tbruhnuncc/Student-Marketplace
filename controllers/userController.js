const mongoose = require("mongoose");
const model = require("../models/user");
let GoogleStrategy = require("passport-google-oidc");
const dotenv = require("dotenv");
dotenv.config();

exports.create = (req, res, next) => {
  console.log(req.body);
  let user = new model(req.body);
  user
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.read = (req, res, next) => {
  let id = req.params.id;
  model
    .findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(err);
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.update = (req, res, next) => {
  let id = req.params.id;
  let user = req.body;
  model
    .findByIdAndUpdate(id, user, {
      useFindAndModify: false,
      runValidators: true,
    })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(err);
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.delete = (req, res, next) => {
  let id = req.params.id;
  model
    .findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.profile = (req, res, next) => {
  let id = req.session.passport.user.id;
  model
    .findById(id)
    .then((user) => {
      if (user) {
        res.render("./user/profile", { user: user });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.create = (req, res, next) => {
  let user = new model(req.body);
  user
    .save()
    .then((result) => {
      res.redirect(`/`);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.register = (req, res, next) => {
  res.render("./user/register");
};

exports.login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  model
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("wrong email address");
      } else {
        if (user.password !== password) {
          console.log("wrong password");
        } else {
          res.redirect(`/users/profile/${user._id}`);
        }
      }
    })
    .catch((err) => next(err));
};

exports.googleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/users/oauth2/redirect/google",
        scope: ["profile", "email"],
      },
      function (issuer, profile, cb) {
        const email = profile.emails[0].value;
        // Check if email ends with the required domain
        if (!email.endsWith("@charlotte.edu")) {
          console.log("Invalid email domain");
          return cb(null, false, { message: "Invalid email domain" });
        }
        model
          .findOne({
            "federatedCredentials.provider": issuer,
            "federatedCredentials.subject": profile.id,
          })
          .then((user) => {
            if (!user) {
              const newUser = new model({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                federatedCredentials: [
                  {
                    provider: issuer,
                    subject: profile.id,
                  },
                ],
              });
              return newUser.save();
            }
            return user;
          })
          .then((user) => cb(null, user))
          .catch((err) => cb(err));
      }
    )
  );
};

exports.serialization = (passport) => {
  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, {
        id: user._id,
      });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      user.id = new mongoose.Types.ObjectId(user.id);
      return cb(null, user);
    });
  });
};

const mongoose = require("mongoose");
const model = require("../models/user");
const productModel = require('../models/product');
const Message = require('../models/message');
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
        // Return multiple promises in an object
        return Promise.all([
          productModel.find({ seller: id }),
          Message.find({
            $or: [{ sender: id }, { recipient: id }]
          })
          .sort({ timestamp: -1 })
          .populate('sender recipient', 'firstName lastName')
        ]).then(([products, messages]) => {
          // Process conversations
          const conversations = [];
          const seenUsers = new Set();

          messages.forEach(msg => {
            const otherUser = msg.sender._id.equals(id) ? msg.recipient : msg.sender;
            
            if (!seenUsers.has(otherUser._id.toString())) {
              seenUsers.add(otherUser._id.toString());
              conversations.push({
                userId: otherUser._id,
                userName: `${otherUser.firstName} ${otherUser.lastName}`,
                lastMessage: msg.content,
                timestamp: msg.timestamp,
                unread: !msg.read && msg.sender._id.equals(otherUser._id)
              });
            }
          });

          return { user, products, conversations };
        });
      }
    })
    .then(({ user, products, conversations }) => {
      res.render("./user/profile", { user, products, conversations });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.viewSellerProfile = (req, res, next) => {
  let sellerId = req.params.id;
  model
    .findById(sellerId)
    .then((user) => {
      if (user) {
        return productModel.find({seller: sellerId}).then((products) => ({user, products}));
      } else {
        next(err);
      }
    })
    .then(({user, products}) => {
      res.render("./user/otherSellerProfile", {user, products});
    })
    .catch((err) => next(err));
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

// to upload new profile picture
exports.uploadProfilePicture = (req, res, next) => {
  let id = req.session.passport.user.id;
  if (req.file) {
    const profilePicturePath = `/images/profile/${req.file.filename}`;
    model
    .findByIdAndUpdate(id, {profilePicture: profilePicturePath})
    .then(() => res.redirect('/users/profile'))
    .catch((err)=> next(err));
  } else {
    req.flash('error', "Please upload a valid image file");
    res.redirect('/users/profile');
  }
}

exports.resetProfilePicture = async (req, res, next) => {
  try {
      const userId = req.session.passport.user.id; // Get the logged-in user's ID
      const defaultProfilePicture = "/images/defaultpro.jpg"; // Path to the default profile picture
      // Update the user's profile picture to the default image
      await model.findByIdAndUpdate(userId, { profilePicture: defaultProfilePicture });
      // Redirect back to the profile page
      res.redirect("/users/profile");
  } catch (error) {
      console.error("Error resetting profile picture:", error);
      next(error); // Pass the error to the error handling middleware
  }
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
                profilePicture: profile.photos[0].value,
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

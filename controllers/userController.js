const mongoose = require("mongoose");
const model = require("../models/user");

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
  let id = req.params.id;
  model
    .findById(id)
    .then((user) => {
      console.log(user);
      if (user) {
        res.render("./user/profile", { user: user });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

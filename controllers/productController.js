const model = require("../models/product");

exports.index = (req, res, next) => {
  model
    .find()
    .then((products) => {
      if (products) {
        res.render("./product/index", { products });
      } else {
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.show = (req, res, next) => {
  let id = req.params.id;
  model
    .findById(id)
    .populate("seller", "firstName lastName")
    .then((product) => {
      if (product) {
        res.render("./product/show", { product });
      } else {
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.new = (req, res, next) => {
  res.render("./product/new");
};

exports.create = (req, res, next) => {
  let product = new model(req.body);
  product.seller = req.session.passport.user.id;
  product.image = "/images/" + req.file.filename;
  product.active = true;
  product.tags = ["placeholder1", "placeholder2"];
  product
    .save()
    .then((result) => {
      res.redirect("/products");
    })
    .catch((err) => {
      next(err);
    });
};

exports.edit = (req, res, next) => {
  let id = req.params.id;
  model
    .findById(id)
    .then((product) => {
      if (product) {
        res.render("./product/edit", { product });
      } else {
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.update = (req, res, next) => {
  let id = req.params.id;
  let part = req.body;
  if (req.file) {
    part.image = "/images/" + req.file.filename;
  }
  model
    .findByIdAndUpdate(id, part, {
      useFindAndModify: false,
      runValidators: true,
    })
    .then((part) => {
      if (part) {
        res.redirect(`/products/${id}`);
      } else {
        let err = new Error('Cannot find product with id ' + req.params.id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      next(err);
    });
}

// exports.delete = (req, res, next) => {
//   let id = req.params.id;
//   model
//     .findByIdAndDelete(id)
//     .then((result) => {
//       if (result) {
//         res.redirect("/products");
//       } else {
//         next(err);
//       }
//     })
//     .catch((err) => next(err));
// };
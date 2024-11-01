const model = require("../models/product");

exports.read = (req, res, next) => {
  let id = req.params.id;
  model
    .findById(id)
    .then((product) => {
      if (product) {
        res.send(product);
      } else {
        next(err);
      }
    })
    .catch((err) => next(err));
};

// exports.delete = (req, res, next) => {
//   let id = req.params.id;
//   model
//     .findByIdAndDelete(id)
//     .then((result) => {
//       if (result) {
//         res.send(result);
//       } else {
//         next(err);
//       }
//     })
//     .catch((err) => next(err));
// };

exports.index = (req, res, next) => {
  let query = {};
  let searchString = req.query.search;
  const regex = new RegExp("^" + searchString, "i");
  if (searchString) {
    const regex = new RegExp("^" + searchString, "i");
    query = { $or: [{ title: regex }, { details: regex }] };
  }
  let products = model
    .find(query)
    .then((products) => {
      products = products.sort((a, b) => a.price - b.price);
      res.render("./product/index", { products });
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

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid product id");
    err.status = 400;
    return next(err);
  }

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
  let product = model.findById(id);

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid product id");
    err.status = 400;
    return next(err);
  }

  let updatedProduct = {
    title: req.body.title,
    condition: req.body.condition,
    price: req.body.price,
    description: req.body.description,
    image: req.body.existingImage,
  };

  if (req.file) {
    updatedProduct.image = "/images/" + req.file.filename;
  }

  model
    .findByIdAndUpdate(id, updatedProduct, { runValidators: true })
    .then((product) => {
      if (product) {
        res.redirect("/products/" + id);
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

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid product id");
    err.status = 400;
    return next(err);
  }

  model
    .findByIdAndDelete(id)
    .then((product) => {
      if (product) {
        res.redirect("/users/profile");
      } else {
        next(err);
      }
    })
    .catch((err) => next(err));
};

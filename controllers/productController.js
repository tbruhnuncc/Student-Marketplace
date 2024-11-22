const product = require("../models/product");
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

exports.index = (req, res, next) => {
  let query = {};
  let searchString = req.query.search;
  let selectedTag = req.query.tag;
  const regex = new RegExp("^" + searchString, "i");
  if (searchString) {
    const regex = new RegExp("^" + searchString, "i");
    query = { $or: [{ title: regex }, { description: regex }] };
  }

  if (selectedTag) {
    query.tags = selectedTag;
  }

  let products = model
    .find(query)
    .then((products) => {
      products = products.sort((a, b) => a.price - b.price);
      res.render("./product/index", {products});
    })
    .catch((err) => next(err));
};

exports.show = (req, res, next) => {
  let id = req.params.id;
  model
    .findById(id)
    .populate('seller', 'firstName lastName')
    .then((product) => {
      console.log(product.seller);  // Check if the session has user data
      if (product) {
        res.render('./product/show', {product: product, user: req.user, session: req.session});
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
  product.image = "/images/products/" + req.file.filename;
  product.active = true;
   // process tags from request body
   product.tags = req.body.tags || []; 
   if (typeof product.tags === "string") {
     product.tags = [product.tags]; // ensures single value is an array
   }

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
    tags: req.body.tags || [],
  };

  if (typeof updatedProduct.tags === "string") {
    updatedProduct.tags = [updatedProduct.tags];
  }

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

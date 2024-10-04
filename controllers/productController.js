const product = require("../models/product");
const model = require("../models/product");

exports.create = (req, res, next) => {
    let product = new model(req.body);
    product.save()
    .then(result => {
        res.send(result);
    })
    .catch(err => {
        next(err);
    });
};

exports.read = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(product=>{
        if (product) {
            res.send(product);
        }
        else {
            next(err);
        }
    })
    .catch(err=>next(err));
}

exports.update = (req, res, next) => {
    let id = req.params.id;
    let part = req.body;
    model.findByIdAndUpdate(id, part, {useFindAndModify: false, runValidators: true})
    .then(part=>{
        if (part) {
            res.send(part);
        }
        else {
            next(err);
        }
    })
    .catch((err)=>{
        next(err);
    });
}

exports.delete = (req, res, next) => {
    let id = req.params.id;
    model.findByIdAndDelete(id)
    .then(result=>{
        if (result) {
            res.send(result);
        }
        else {
            next(err);
        }
    })
    .catch(err=>next(err));
}

exports.index = (req, res, next) => {
    model.find()
    .then(products=>{
        if (products) {
            res.render("./product/index", {products});
        }
        else {
            next(err);
        }
    })
    .catch(err=>next(err));
}

exports.show = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(product=>{
        if (product) {
            res.render("./product/show", {product});
        }
        else {
            next(err);
        }
    })
    .catch(err=>next(err));
}

exports.new = (req, res, next) => {
    res.render("./product/new");
}

exports.create = (req, res, next) => {
    console.log(req.body);
    let product = new model(req.body);
    product.image = "/images/couch.jpg";
    product.active = true;
    product.tags = ["placeholder1", "placeholder2"];
    product.save()
    .then(result => {
        res.redirect("/products");
    })
    .catch(err => {
        next(err);
    });
}
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
    // let product = new model({
    //     title: "Product",
    //     description: "This is a product",
    //     image: "image.png",
    //     price: 10,
    //     condition: "Used",
    //     tags: ["tag1", "tag2"],
    //     seller: "Seller",
    //     active: true
    // });
    // product.save();
    // if (product) {
    //     res.send(product);
    // }    
    // else {
    //     next(err);
    // }
    model.find()
    .then(parts=>{
        if (parts) {
            res.render("./product/index", {parts});
        }
        else {
            next(err);
        }
    })
    .catch(err=>next(err));
}
const express = require('express');
const controller = require('../controllers/productController');

const router = express.Router();

//GET /products: send all products
router.get('/', controller.index)

// //GET /products/new: send html form for creating a new product
// router.get('/new', controller.new)

// //POST /products: create a new product
// router.post('/', controller.create)

//GET /products/:id : send details of one product
router.get('/:id', controller.show)

// //GET /products/:id/edit : send html form for editing a product
// router.get('/:id/edit',controller.edit)

// //PUT /products/:id : update product identified by id
// router.put('/:id', controller.update)

// //DELETE /products/:id : delete product identified by id
// router.delete('/:id', controller.delete)

// router.use('/offers', offerRoutes)

module.exports = router;
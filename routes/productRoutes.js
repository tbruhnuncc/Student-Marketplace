const express = require('express');
const controller = require('../controllers/productController');
const { isLoggedIn, isGuest } = require("../middleware/auth");

const router = express.Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
      }
})

const fileFilter = (req, file, cb) => {
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if(mimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only jpg, jpeg, png, and gif image files are allowed'), false);
    }
}

const upload = multer({storage, fileFilter, limits: {fileSize: 2*1024_1024}}).single('image');

//GET /products: send all products
router.get('/', controller.index)

//GET /products/new: send html form for creating a new product
router.get('/new', isLoggedIn, controller.new)

//POST /products: create a new product
router.post('/', isLoggedIn, upload, controller.create)

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
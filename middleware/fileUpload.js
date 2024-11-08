const multer = require('multer');
const path = require('path');

// profile picture storage
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/profile');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// product image storage
const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/products');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (mimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only jpg, jpeg, png, and gif image files are allowed'), false);
    }
};

const uploadProfilePicture = multer({ storage: profileStorage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }).single('profilePicture');
const uploadProductImage = multer({ storage: productStorage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }).single('productImage');

module.exports = { uploadProfilePicture, uploadProductImage };
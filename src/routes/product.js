const multer = require('multer');
const express = require('express');
const auth = require('../middlewares/auth');
const productControllers = require('../controllers/product');
const { validateProductData, validateProductUpdates } = require('../validation/productSchema');

// Create a new Router
const router = express.Router();

// multer configuration
const upload = multer({
    storage: multer.memoryStorage(), // Use memory storage for simplicity
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
    }
});

/**************************************************Endpoint for Customers ********************************************************/

//Add a rate to a product
router.patch('/product/addRate/:id', auth, productControllers.addRate);

/**************************************************Endpoint for Admin & staff ****************************************************/

// Add a new product
router.post('/product', auth, validateProductData, productControllers.addNewProduct);

// Upload images of a product on S3 bucket
router.post('/product/images', auth, upload.array('file'), productControllers.uploadProductImage);

//delete an existing product
router.delete('/product/:id', auth, productControllers.deleteProduct);

//Edit data of an existing product
router.patch('/product/:id', auth, validateProductUpdates, productControllers.editProduct);

//Increase the quantity of a product in stock by specified number
router.patch('/product/increaseStock/:id', auth, productControllers.increaseStock);

//Add a car to the compatible cars of a product
router.patch('/product/addCar/:id', auth, productControllers.addCar);

//Remove a car from the compatible cars of a product
router.patch('/product/removeCar/:id', auth, productControllers.removeCar);

/********************************************Endpoint for product (Customer & Staff)***********************************************/

//Get all products
router.get('/products', auth, productControllers.getAllProducts);

//Get a product by id
router.get('/product/:id', auth, productControllers.getProductById);

//Get a product by product code
router.get('/productCode', auth, productControllers.getProductByCode);

//Get a product by category
router.get('/products/category', auth, productControllers.getProductByCategory);

//Get products by car ID
router.get('/products/car/:id', auth, productControllers.getProductByCar);

//Decrease the quantity of a product in stock
router.patch('/product/decreaseStock/:id', auth, productControllers.decreaseStock);

module.exports = router;
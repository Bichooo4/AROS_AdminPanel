const ftp = require('basic-ftp');
const { v4: uuidv4 } = require('uuid');
const { Readable } = require('stream');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');
const checkUserRole = require('../helpers/UserRole');
const productServices = require('../services/product');


const productControllers = {
    addNewProduct: async (req, res, next) => {
        try {
            // Check if the user is a staff or customer
            checkUserRole('staff')(req, res, next);

            const { itemCode, name, description, price, category, image_URL, quantityInStock, compatibleCars } = req.body;

            // Check if product with the same item code already exists in the database
            await productServices.checkProductExist(itemCode);

            // Check if all compatibleCars IDs exist in the database
            await productServices.checkCompatibleCarsExist(compatibleCars);

            const productData = {
                itemCode,
                name,
                description,
                price,
                category,
                image_URL,
                quantityInStock,
                compatibleCars,
            };

            const product = await productServices.addProduct(productData);

            res.status(201).json({
                status: 'success',
                message: 'Product created successfully',
                data: product,
            });

        } catch (error) {
            next(error);
        }
    },

    uploadProductImage: async (req, res, next) => {
        try {
            // Check if the user is a staff or customer
            checkUserRole('staff')(req, res, next);

            let files = req.files;
            if (files.length === 0) {
                throw new BadRequest('Images not found');
            };

            const client = new ftp.Client();
            await client.access({
                host: "ftp.sirv.com",
                user: process.env.SIRV_USER,
                password: process.env.SIRV_PASSWORD,
            });

            const imageUrls = [];

            for (const img of files) {
                try {
                    const uuid = uuidv4();
                    if (img && img.buffer) {
                        await client.upload(Readable.from(img.buffer), uuid);
                        imageUrls.push(`https://itaretet.sirv.com/${uuid}`);
                    } else {
                        throw new BadRequest('Image not found');
                    }
                } catch (error) {
                    throw new BadRequest('Image upload failed');
                }
            }

            await client.close();

            res.status(200).json({
                status: 'success',
                message: 'Images uploaded successfully',
                data: imageUrls,
            });

        } catch (error) {
            next(error);
        }
    },

    deleteProduct: async (req, res, next) => {
        try {
            // Check if the user is a staff or customer
            checkUserRole('staff')(req, res, next);

            const productId = req.params.id;
            await productServices.deleteProduct(productId);

            res.status(200).json({
                status: 'success',
                message: 'Product deleted successfully',
            });

        } catch (error) {
            next(error);
        }
    },

    editProduct: async (req, res, next) => {
        try {
            // Check if the user is a staff or customer
            checkUserRole('staff')(req, res, next);

            const productId = req.params.id;
            const updatedProductData = req.body;
            const updates = Object.keys(req.body);
            const allowedUpdates = ['name', 'description', 'price', 'category', 'image_URL'];
            const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

            if (!isValidOperation) {
                throw new Forbidden('you are not allowed to update these fields');
            }

            const product = await productServices.editProduct(productId, updatedProductData);

            res.status(200).send({
                status: 'success',
                message: 'Product updated successfully.',
                product
            });
        } catch (error) {
            next(error);
        }
    },

    getAllProducts: async (req, res, next) => {
        try {
            const products = await productServices.getAllProducts();

            res.status(200).json({
                status: 'success',
                message: 'Products retrieved successfully',
                data: products,
            });
        } catch (error) {
            next(error);
        }
    },

    getProductById: async (req, res, next) => {
        try {
            const productId = req.params.id;

            const product = await productServices.getProductById(productId);

            res.status(200).json({
                status: 'success',
                message: 'Product retrieved successfully',
                data: product,
            });
        } catch (error) {
            next(error);
        }
    },

    getProductByCode: async (req, res, next) => {
        try {
            const productCode = req.query.code;

            const product = await productServices.getProductByCode(productCode);

            res.status(200).json({
                status: 'success',
                message: 'Product retrieved successfully',
                data: product,
            });
        } catch (error) {
            next(error);
        }
    },

    getProductByCategory: async (req, res, next) => {
        try {
            const category = req.query.category;

            const products = await productServices.getProductByCategory(category);

            res.status(200).json({
                status: 'success',
                message: 'Products retrieved successfully',
                data: products,
            });
        } catch (error) {
            next(error);
        }
    },

    getProductByCar: async (req, res, next) => {
        try {
            const carID = req.params.id;

            const products = await productServices.getProductByCar(carID);

            res.status(200).json({
                status: 'success',
                message: 'Products retrieved successfully',
                data: products,
            });
        } catch (error) {
            next(error);
        }
    },

    decreaseStock: async (req, res, next) => {
        try {
            const productId = req.params.id;
            let quantity = req.body.quantity || 1;

            const product = await productServices.decreaseStock(productId, quantity);

            res.status(200).send({
                status: 'success',
                message: `Product stock decreased successfully by ${quantity}.`,
                product
            });
        } catch (error) {
            next(error);
        }
    },

    increaseStock: async (req, res, next) => {
        try {
            // Check if the user is a staff or customer
            checkUserRole('staff')(req, res, next);

            const productId = req.params.id;
            const quantity = req.body.quantity;

            const product = await productServices.increaseStock(productId, quantity);

            res.status(200).send({
                status: 'success',
                message: `Product stock increased successfully by ${quantity}.`,
                product
            });
        } catch (error) {
            next(error);
        }
    },

    addRate: async (req, res, next) => {
        try {
            // Check if the user is a staff or customer
            checkUserRole('customer')(req, res, next);

            const productId = req.params.id;
            const rate = req.body.rate;

            if (rate < 0 || rate > 5) {
                throw new BadRequest('Rate must be between 0 and 5');
            };

            const product = await productServices.addRate(productId, rate);

            res.status(200).send({
                status: 'success',
                message: 'Rate added successfully.',
                product
            });
        } catch (error) {
            next(error);
        }
    },

    addCar: async (req, res, next) => {
        try {
            // Check if the user is a staff or customer
            checkUserRole('staff')(req, res, next);

            const productId = req.params.id;
            const carId = req.body.carId;

            // Check if all compatibleCars IDs exist in the database
            await productServices.checkCompatibleCarExist(carId);

            const product = await productServices.addCar(productId, carId);

            res.status(200).send({
                status: 'success',
                message: 'Car added successfully.',
                product
            });
        } catch (error) {
            next(error);
        }
    },

    removeCar: async (req, res, next) => {
        try {
            // Check if the user is a staff or customer
            checkUserRole('staff')(req, res, next);

            const productId = req.params.id;
            const carId = req.body.carId;

            const product = await productServices.removeCar(productId, carId);

            res.status(200).send({
                status: 'success',
                message: 'Car removed successfully.',
                product
            });
        } catch (error) {
            next(error);
        }
    },

};

module.exports = productControllers;
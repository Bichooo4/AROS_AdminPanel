const Car = require('../models/Car');
const product = require('../models/product');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');

const productServices = {
    addProduct: async (productData) => {
        try {
            const newProduct = await product.create(productData);

            if (!newProduct) {
                throw new Error('Something went wrong while adding new product');
            }

            return newProduct;
        } catch (error) {
            throw error;
        }
    },

    checkProductExist: async (itemCode) => {
        try {
            const productData = await product.findOne({ itemCode });

            if (productData) {
                throw new BadRequest('Product with the same item code already exists in the database');
            }

            return;
        } catch (error) {
            throw error;
        }
    },

    checkCompatibleCarsExist: async (compatibleCars) => {
        try {
            for (const carId of compatibleCars) {
                const carExists = await Car.findById(carId);

                if (!carExists) {
                    throw new BadRequest(`Car with ID ${carId} does not exist in the database`);
                }
            }

            return;
        } catch (error) {
            throw error;
        }
    },

    checkCompatibleCarExist: async (carId) => {
        try {
            const carExists = await Car.findById(carId);

            if (!carExists) {
                throw new BadRequest(`Car with ID ${carId} does not exist in the database`);
            }

            return;
        } catch (error) {
            throw error;
        }
    },

    deleteProduct: async (productId) => {
        try {
            const deletedProduct = await product.findByIdAndDelete(productId);

            if (!deletedProduct) {
                throw new NotFound('Product not found');
            }

            return;
        } catch (error) {
            throw error;
        }
    },

    editProduct: async (productId, updatedFields) => {
        try {
            const updatedProduct = await product.findByIdAndUpdate(productId, updatedFields, { new: true, runValidators: true });

            if (!updatedProduct) {
                throw new NotFound('Product not found');
            }

            return updatedProduct;
        } catch (error) {
            throw error;
        }
    },

    getAllProducts: async () => {
        try {
            const products = await product.find();

            if (!products) {
                throw new NotFound('there is no products in the database');
            }

            return products;
        } catch (error) {
            throw error;
        }
    },

    getProductById: async (productId) => {
        try {
            const productData = await product.findById(productId);

            if (!productData) {
                throw new NotFound('Product not found');
            }

            return productData;
        } catch (error) {
            throw error;
        }
    },

    getProductByCode: async (itemCode) => {
        try {
            const productData = await product.findOne({ itemCode });

            if (!productData) {
                throw new NotFound('Product not found');
            }

            return productData;
        } catch (error) {
            throw error;
        }
    },

    getProductByCategory: async (category) => {
        try {
            const products = await product.find({ category });

            if (!products) {
                throw new NotFound('No products in this category found in the database');
            }

            return products;
        } catch (error) {
            throw error;
        }
    },

    getProductByCar: async (carID) => {
        try {
            const products = await product.find({ compatibleCars: carID });

            if (!products) {
                throw new NotFound('No products found in the database');
            }

            return products;
        } catch (error) {
            throw error;
        }
    },

    decreaseStock: async (productId, quantity) => {
        try {
            const productData = await product.findById(productId);

            if (!productData) {
                throw new NotFound('Product not found');
            }

            if (productData.quantityInStock < quantity) {
                throw new BadRequest('Not enough quantity in stock');
            }

            productData.quantityInStock -= quantity;
            const updatedProduct = await productData.save();

            if (!updatedProduct) {
                throw new Error('Something went wrong while updating product stock');
            }

            return updatedProduct;

        } catch (error) {
            throw error;
        }
    },

    increaseStock: async (productId, quantity) => {
        try {
            const productData = await product.findById(productId);

            if (!productData) {
                throw new NotFound('Product not found');
            }

            productData.quantityInStock += quantity;
            const updatedProduct = await productData.save();

            if (!updatedProduct) {
                throw new Error('Something went wrong while updating product stock');
            }

            return updatedProduct;

        } catch (error) {
            throw error;
        }
    },

    addRate: async (productId, rate) => {
        try {
            const productData = await product.findById(productId);

            if (!productData) {
                throw new NotFound('Product not found');
            };

            productData.rates.push(rate);
            const updatedProduct = await productData.save();

            if (!updatedProduct) {
                throw new Error('Something went wrong while updating product rates');
            };

            return updatedProduct;

        } catch (error) {
            throw error;
        }
    },

    addCar: async (productId, carId) => {
        try {
            const productData = await product.findById(productId);

            if (!productData) {
                throw new NotFound('Product not found');
            }

            productData.compatibleCars.push(carId);
            const updatedProduct = await productData.save();

            if (!updatedProduct) {
                throw new Error('Something went wrong while updating product compatible cars');
            }

            return updatedProduct;

        } catch (error) {
            throw error;
        }
    },

    removeCar: async (productId, carId) => {
        try {
            const productData = await product.findById(productId);

            if (!productData) {
                throw new NotFound('Product not found');
            }

            const carIndex = productData.compatibleCars.indexOf(carId);

            if (carIndex === -1) {
                throw new NotFound('Car not found in the compatible cars of this product');
            }

            productData.compatibleCars.splice(carIndex, 1);
            const updatedProduct = await productData.save();

            if (!updatedProduct) {
                throw new Error('Something went wrong while updating product compatible cars');
            }

            return updatedProduct;

        } catch (error) {
            throw error;
        }
    }
};

module.exports = productServices;
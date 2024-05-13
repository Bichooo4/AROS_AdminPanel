const yup = require('yup');
const mongoose = require('mongoose');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

// MongoDB ObjectId validation using mongoose library
const objectIdValidator = yup.mixed().test({
    name: 'is-mongoose-id',
    message: 'Invalid ObjectId',
    test: value => mongoose.Types.ObjectId.isValid(value)
});

// Define the schema for product data validation using yup library
const productSchema = yup.object().shape({
    itemCode: yup
        .string()
        .required('Item code is required')
        .min(4, 'Item code must be at least 4 characters long'),
    name: yup
        .string()
        .required('Name is required')
        .trim(),
    description: yup
        .string()
        .required('Description is required')
        .trim(),
    price: yup
        .number()
        .typeError('Price must be a positive number')
        .required('Price is required')
        .positive('Price must be a positive number'),
    rates: yup.array().of(
        yup.number().min(0).max(5)
    ),
    image_URL: yup.array().of(
        yup.string().url().required('At least one image of product must be provided')
    ),
    quantityInStock: yup
        .number()
        .typeError('Quantity in stock must be a positive integer number')
        .positive('Quantity in stock must be a positive integer number')
        .integer('Quantity in stock must be a positive integer number')
        .required('Quantity in stock is required'),
    category: yup
        .string()
        .required('Category is required')
        .trim(),
    compatibleCars: yup
        .array()
        .of(objectIdValidator)
});

// Function to validate product data
const validateProductData = async (req, res, next) => {
    try {

        const validationErrors = [];
        try {
            await productSchema.validate(req.body, { abortEarly: false });
        } catch (error) {
            validationErrors.push(...error.errors);
        }

        if (validationErrors.length > 0) {
            const errorMessage = validationErrors.join(', ').toString();
            throw new BadRequest(errorMessage);
        }

        next();
    } catch (error) {
        next(error);
    }
};

// Function to validate updates on product data
const validateProductUpdates = async (req, res, next) => {
    try {
        const validationErrors = [];
        const updatedFields = req.body;

        const fieldToValidate = Object.keys(updatedFields);
        for (const fieldName of fieldToValidate) {
            const fieldSchema = yup.lazy(value => {
                if (productSchema.fields[fieldName]) {
                    return productSchema.fields[fieldName];
                } else {
                    throw new Forbidden(`${fieldName} cannot be updated.`);
                }
            });

            try {
                await fieldSchema.validate(updatedFields[fieldName]);
            } catch (error) {
                validationErrors.push(error.errors);
            }
        }

        if (validationErrors.length > 0) {
            const errorMessage = validationErrors.join(', ').toString();
            throw new BadRequest(errorMessage);
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateProductData,
    validateProductUpdates
};
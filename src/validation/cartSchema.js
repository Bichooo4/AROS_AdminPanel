const yup = require('yup');
const mongoose = require('mongoose');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

const objectIdValidator = yup.mixed().test({
    name: 'is-mongoose-id',
    message: 'Invalid ObjectId',
    test: value => mongoose.Types.ObjectId.isValid(value)
});

const cartSchema = yup.object().shape({
    user_id: yup
        .string()
        .required('User ID is required.')
        .test({
            name: 'is-mongoose-id',
            message: 'Invalid ObjectId',
            test: value => mongoose.Types.ObjectId.isValid(value)
        }),
    products: yup
        .array()
        .of(objectIdValidator)
        .required('Products are required.')
});

const validateCartDataMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        try {
            await cartSchema.validate(req.body, { abortEarly: false });
        } catch (error) {
            validationErrors.push(...error.errors);
        }

        if (validationErrors.length > 0) {
            throw new BadRequest(validationErrors.join(', '));
        }

        next();
    } catch (error) {
        next(error);
    }
};

const validateCartUpdatesMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        const updatedFields = req.body;

        const fieldToValidate = Object.keys(updatedFields);
        for (const fieldName of fieldToValidate) {
            const fieldSchema = yup.lazy(value => {
                if (cartSchema.fields[fieldName]) {
                    return cartSchema.fields[fieldName];
                } else {
                    throw new Forbidden(`${fieldName} cannot be updated.`);
                }
            });

            try {
                await fieldSchema.validate(updatedFields[fieldName], { abortEarly: false });
            } catch (error) {
                const fieldErrors = error.errors.map(errorMessage => errorMessage);
                validationErrors.push(...fieldErrors);
            }
        }

        if (validationErrors.length > 0) {
            throw new BadRequest(validationErrors.join(', '));
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateCartDataMiddleware,
    validateCartUpdatesMiddleware,
};
const yup = require('yup');
const mongoose = require('mongoose');
const BadRequest = require('../errors/BadRequest');

const objectIdValidator = yup.mixed().test({
    name: 'is-mongoose-id',
    message: 'Invalid ObjectId',
    test: value => mongoose.Types.ObjectId.isValid(value)
});

const carSchema = yup.object().shape({
    brand: yup
        .string()
        .required('Brand is required.'),
    model: yup
        .string()
        .required('Model is required.'),
    productionYear: yup
        .number()
        .required('Production year is required.')
        .positive('Production year must be a positive number.')
        .integer('Production year must be an integer.')
        .min(1885, 'Production year must be at least 1885.')
        .max(new Date().getFullYear() + 1, 'Production year cannot be in the future.'),
    owners: yup
        .array()
        .of(objectIdValidator)
});

const validateCarDataMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        try {
            await carSchema.validate(req.body, { abortEarly: false });
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

module.exports = {
    validateCarDataMiddleware
};
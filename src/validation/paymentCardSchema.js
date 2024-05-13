const yup = require('yup');
const mongoose = require('mongoose');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

const paymentCardSchema = yup.object().shape({
    cardNumber: yup
        .string()
        .required('Card number is required.')
        .length(16, 'Card number must be 16 digits long.'),
    cvv: yup
        .string()
        .required('CVV is required.')
        .min(3, 'CVV must be 3 or 4 digits long.')
        .max(4, 'CVV must be 3 or 4 digits long.'),
    expirationDate: yup
        .string()
        .required('Expiration date is required.')
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format.')
        .test('is-future-date', 'Expiration date must be in the future.', function (value) {
            const currentDate = new Date();
            const expirationDate = new Date(value.replace(/(\d{2})\/(\d{2})/, "$2/$1")); // Convert MM/YY to MM/DD/YYYY format
            return expirationDate > currentDate;
        }),
});

const validatePaymentCardDataMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        try {
            await paymentCardSchema.validate(req.body, { abortEarly: false });
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

const validatePaymentCardUpdatesMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        const updatedFields = req.body;

        const fieldToValidate = Object.keys(updatedFields);
        for (const fieldName of fieldToValidate) {
            const fieldSchema = yup.lazy(value => {
                if (paymentCardSchema.fields[fieldName]) {
                    return paymentCardSchema.fields[fieldName];
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
            throw new BadRequest(validationErrors.join(', '));
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    paymentCardSchema,
    validatePaymentCardDataMiddleware,
    validatePaymentCardUpdatesMiddleware,
};
const yup = require('yup');
const mongoose = require('mongoose');
const validator = require('validator');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

// Define a custom validation function for password strength
const isStrongPassword = value => validator.isStrongPassword(value);

// Create a schema for the user model
const userSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name is required'),
    email: yup
        .string()
        .email()
        .required('Email is required'),
    password: yup
        .string()
        .required()
        .test('is-strong-password', 'Password is too weak', function (value) {
            if (!isStrongPassword(value)) {
                return false;
            } else {
                return true;
            }
        }),
    phone: yup
        .object()
        .shape({
            country_code: yup
                .string()
                .required()
                .matches(/^\+[1-9]\d{0,2}$/, '${value} is not a valid country code!'),
            number: yup
                .string()
                .required()
                .matches(/^\d{5,15}$/, '${value} is not a valid phone number!'),
        }),
    role: yup
        .string()
        .default('customer')
        .oneOf(['customer', 'staff']),
});

// Middleware to validate user data
const validateUserDataMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        try {
            await userSchema.validate(req.body, { abortEarly: false });
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

// Middleware to validate user data updates
const validateUserUpdatesMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        const updatedFields = req.body;

        const fieldToValidate = Object.keys(updatedFields);
        for (const fieldName of fieldToValidate) {
            const fieldSchema = yup.lazy(value => {
                if (userSchema.fields[fieldName]) {
                    return userSchema.fields[fieldName];
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
    validateUserDataMiddleware,
    validateUserUpdatesMiddleware,
};
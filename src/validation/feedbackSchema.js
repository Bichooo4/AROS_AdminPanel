const yup = require('yup');
const mongoose = require('mongoose');
const BadRequest = require('../errors/BadRequest');

// Define the validation schema with Yup to match the new Mongoose schema
const feedbackSchema = yup.object().shape({
    name: yup
        .string()
        .trim(),
    email: yup
        .string()
        .trim()
        .lowercase()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email address'
        ),
    phone: yup.object().shape({
        country_code: yup
            .string()
            .matches(/^\+[1-9]\d{0,2}$/, 'Invalid country code'),
        number: yup
            .string()
            .matches(/^\d{5,15}$/, 'Invalid phone number'),
    }),
    feedback: yup
        .string()
        .required('Feedback is required')
        .trim(),
    highlighted: yup
        .boolean()
        .default(false),
});

// Define a middleware function to validate the request body against the schema
const validateFeedbackData = async (req, res, next) => {
    try {

        const validationErrors = [];
        try {
            await feedbackSchema.validate(req.body, { abortEarly: false });
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

module.exports = {
    validateFeedbackData
};
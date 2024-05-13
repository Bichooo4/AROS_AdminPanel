const yup = require('yup');
const mongoose = require('mongoose');
const BadRequest = require('../errors/BadRequest');

const objectIdValidator = yup.mixed().test({
    name: 'is-mongoose-id',
    message: 'Invalid ObjectId',
    test: value => mongoose.Types.ObjectId.isValid(value)
});

const reviewSchema = yup.object().shape({
    user_id: yup
        .required('User ID is required')
        .test('is-mongoose-id', 'Invalid ObjectId', value => mongoose.Types.ObjectId.isValid(value)),
    comment: yup
        .string()
        .required('Comment is required')
        .trim(),
});

// Middleware to validate review data
const validateReviewDataMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        try {
            await reviewSchema.validate(req.body, { abortEarly: false });
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
    validateReviewDataMiddleware,
};
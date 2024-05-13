const yup = require('yup');
const mongoose = require('mongoose');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

const objectIdValidator = yup.mixed().test({
    name: 'is-mongoose-id',
    message: 'Invalid ObjectId',
    test: value => mongoose.Types.ObjectId.isValid(value)
});

const CouponSchema = yup.object().shape({
    code: yup
        .string()
        .required('Coupon code is required')
        .test({
            name: 'unique-code',
            message: 'Coupon code already exists',
            test: async function (value) {
                const coupon = await this.parent.findOne({ code: value });
                return !coupon;
            }
        }),
    type: yup
        .string()
        .required('Coupon type is required')
        .oneOf(['discount', 'free_shipping', 'free_item']),
    discount: yup
        .number()
        .when('type', {
            is: 'discount',
            then: yup
                .number()
                .required('Discount value is required')
                .min(0, 'Discount value must be greater than or equal to 0')
                .max(100, 'Discount value must be less than or equal to 100')
        }),
    max_usage: yup
        .number()
        .default(1),
    valid_until: yup
        .date()
        .required('Coupon expiry date is required'),
    valid_for: yup
        .string()
        .required('Coupon valid for is required')
        .oneOf(['first_order', 'all_orders', 'specific_products', 'specific_categories', 'specific_users']),
    users: yup
        .array()
        .of(objectIdValidator)
        .when('valid_for', {
            is: 'specific_users',
            then: yup.array().required('Users are required')
        }),
    products: yup
        .array()
        .of(objectIdValidator)
        .when('valid_for', {
            is: 'specific_products',
            then: yup.array().required('Products are required')
        }),
    categories: yup
        .array()
        .of(yup.string())
        .when('valid_for', {
            is: 'specific_categories',
            then: yup.array().required('Categories are required')
        })
});

const validateCouponDataMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        try {
            await CouponSchema.validate(req.body, { abortEarly: false, parent: mongoose.model('Coupon') });
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

const validateCouponUpdatesMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        const updatedFields = req.body;

        const fieldToValidate = Object.keys(updatedFields);
        for (const fieldName of fieldToValidate) {
            const fieldSchema = yup.lazy(value => {
                if (CouponSchema.fields[fieldName]) {
                    return CouponSchema.fields[fieldName];
                } else {
                    throw new Forbidden(`${fieldName} cannot be updated.`);
                }
            });

            try {
                await fieldSchema.validate(updatedFields[fieldName], { abortEarly: false, parent: mongoose.model('Coupon') });
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
    validateCouponDataMiddleware,
    validateCouponUpdatesMiddleware
};
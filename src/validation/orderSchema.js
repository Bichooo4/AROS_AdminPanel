const yup = require('yup');
const mongoose = require('mongoose');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');
const { addressSchema, validateAddressDataMiddleware, validateAddressUpdatesMiddleware } = require('./addressSchema');
const { paymentCardSchema, validatePaymentCardDataMiddleware, validatePaymentCardUpdatesMiddleware } = require('./paymentCardSchema');

const objectIdValidator = yup.mixed().test({
    name: 'is-mongoose-id',
    message: 'Invalid ObjectId',
    test: value => mongoose.Types.ObjectId.isValid(value)
});

const orderSchema = yup.object().shape({
    customerData:
        objectIdValidator
            .required('Customer ID is required.'),
    items: yup
        .array()
        .of(yup
            .object()
            .shape({
                product: objectIdValidator,
                quantity: yup
                    .number()
                    .required('Quantity is required.'),
                price: yup
                    .number().
                    required('Price is required.'),
                total: yup
                    .number()
                    .required('Total is required.')
            }))
        .required('Items are required.'),
    totalAmountWithoutDeleviry: yup
        .number()
        .required('Total amount without delivery is required.'),
    couponUsage: objectIdValidator,
    discount: yup
        .number()
        .required('Discount is required.').default(0),
    delivery_charge: yup
        .number()
        .required('Delivery charge is required.'),
    totalAmount: yup
        .number()
        .required('Total amount is required.'),
    status: yup
        .string()
        .oneOf(['processing', 'completed', 'cancelled']).default('processing'),
    paymentMethod: yup
        .string()
        .oneOf(['cod', 'card'])
        .required('Payment method is required.'),
    paymentStatus: yup
        .string()
        .oneOf(['pending', 'completed', 'failed']).default('pending'),
    paymentCard: yup.lazy(value => {
        if (value && value.paymentMethod === 'card') {
            return paymentCardSchema;
        }
        return yup.mixed().notRequired();
    }),
    shippingAddress: addressSchema, // Use addressSchema for shippingAddress
    deliveryDate: yup
        .date()
        .required('Delivery date is required.'),
    deliveryTime: yup
        .string()
        .required('Delivery time is required.'),
    deliveryInstructions: yup
        .string(),
    customerNotes: yup
        .string(),
    orderSource: yup
        .string()
        .oneOf(['website', 'mobile_app'])
        .required('Order source is required.'),
});

const validateOrderDataMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        try {
            await orderSchema.validate(req.body, { abortEarly: false });
            // Validate shipping address
            await validateAddressDataMiddleware(req, res, next);
            // Validate payment card if payment method is card
            if (req.body.paymentMethod === 'card') {
                await validatePaymentCardDataMiddleware(req, res, next);
            }
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

const validateOrderUpdatesMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        const updatedFields = req.body;

        const fieldToValidate = Object.keys(updatedFields);
        for (const fieldName of fieldToValidate) {
            const fieldSchema = yup.lazy(value => {
                if (orderSchema.fields[fieldName]) {
                    return orderSchema.fields[fieldName];
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

        // Validate updated shipping address if exists
        if (updatedFields.shippingAddress) {
            await validateAddressUpdatesMiddleware(req, res, next);
        }

        // Validate updated payment card if exists and payment method is card
        if (updatedFields.paymentCard && updatedFields.paymentMethod === 'card') {
            await validatePaymentCardUpdatesMiddleware(req, res, next);
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateOrderDataMiddleware,
    validateOrderUpdatesMiddleware,
};

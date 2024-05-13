const yup = require('yup');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

const addressSchema = yup.object().shape({
    country: yup
        .string()
        .required('Country is required'),
    city: yup
        .string()
        .required('City is required'),
    region: yup
        .string()
        .required('Region is required'),
    street: yup
        .string()
        .required('Street is required'),
    buildingNo: yup
        .string()
        .required('Building number is required'),
    floorNo: yup
        .number()
        .required('Floor number is required')
        .typeError('Floor number must be a number')
        .positive('Floor number must be a positive number')
        .integer('Floor number must be an integer'),
    apartmentNo: yup
        .number()
        .required('Apartment number is required')
        .typeError('Apartment number must be a number')
        .positive('Apartment number must be a positive number')
        .integer('Apartment number must be an integer'),
    notes: yup
        .string(),
});

const validateAddressDataMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        try {
            await addressSchema.validate(req.body, { abortEarly: false });
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

const validateAddressUpdatesMiddleware = async (req, res, next) => {
    try {
        const validationErrors = [];
        const updatedFields = req.body;

        const fieldToValidate = Object.keys(updatedFields);
        for (const fieldName of fieldToValidate) {
            const fieldSchema = yup.lazy(value => {
                if (addressSchema.fields[fieldName]) {
                    return addressSchema.fields[fieldName];
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
            const errorMessage = validationErrors.join(', ').toString();
            throw new BadRequest(errorMessage);
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addressSchema,
    validateAddressDataMiddleware,
    validateAddressUpdatesMiddleware,
};
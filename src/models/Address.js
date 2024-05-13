const mongoose = require('mongoose');
const validator = require('validator');

const addressSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    buildingNo: {
        type: String,
        required: true,
    },
    floorNo: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isNumeric(value) && value > 0;
            },
            message: props => `Floor number "${props.value}" must be a positive number`
        },
    },
    apartmentNo: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isNumeric(value) && value > 0;
            },
            message: props => `Apartment number "${props.value}" must be a positive number`
        },
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
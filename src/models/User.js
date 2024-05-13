const Car = require('./Car');
const mongoose = require('mongoose');
const Address = require('./Address');
const validator = require('validator');
const PaymentCard = require('./PaymentCard');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email address');
                }
            },
            message: props => `${props.value} is not a valid email address!`
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error('Password is too weak');
                }
            },
            message: props => `The password is too weak!`
        },
    },
    phone: {
        country_code: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return /^\+[1-9]\d{0,2}$/.test(value);
                },
                message: props => `${props.value} is not a valid country code!`
            },
        },
        number: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return /^\d{5,15}$/.test(value);
                },
                message: props => `${props.value} is not a valid phone number!`
            },
        }
    },
    role: {
        type: String,
        default: 'customer',
        enum: ['customer', 'staff'],
    },
    ownedCars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
    }],
    address: [Address.schema],
    paymentCardDetails: [PaymentCard.schema],
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
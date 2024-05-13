const mongoose = require('mongoose');
const validator = require('validator');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
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
    phone: {
        country_code: {
            type: String,
            validate: {
                validator: function (value) {
                    return /^\+[1-9]\d{0,2}$/.test(value);
                },
                message: props => `${props.value} is not a valid country code!`
            },
        },
        number: {
            type: String,
            validate: {
                validator: function (value) {
                    return /^\d{5,15}$/.test(value);
                },
                message: props => `${props.value} is not a valid phone number!`
            },
        }
    },
    feedback: {
        type: String,
        required: true,
        trim: true,
    },
    highlighted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
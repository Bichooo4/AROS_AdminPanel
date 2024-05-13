const User = require('./User');
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    productionYear: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return Number.isInteger(value) && value > 1885;
            },
            message: 'Production year must be a positive integer number.',
        },
    },
    owners: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
}, {
    timestamps: true,
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
const mongoose = require('mongoose');

const paymentCardSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true,
        minlength: 16,
        maxlength: 16,
    },
    cvv: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 4,
    },
    expirationDate: {
        type: String,
        required: true,
        match: /^(0[1-9]|1[0-2])\/\d{2}$/, // Regular expression to validate MM/YY format
    }
}, {
    timestamps: true,
});

const PaymentCard = mongoose.model('PaymentCard', paymentCardSchema);

module.exports = PaymentCard;
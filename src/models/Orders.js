const User = require('./User');
const Coupon = require('./Coupon');
const mongoose = require('mongoose');
const Address = require('./Address');
const Product = require('./Product');
const PaymentCard = require('./PaymentCard');

const orderSchema = new mongoose.Schema({
    customerData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            total: {
                type: Number,
                required: true,
            },
        }],
        required: true,
    },
    totalAmountWithoutDeleviry: {
        type: Number,
        required: true,
    },
    couponUsage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
    },
    delivery_charge: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'cancelled'],
        default: 'processing',
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'card'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    paymentCard: {
        type: PaymentCard,
        required: function () {
            return this.paymentMethod === 'card';
        },
    },
    shippingAddress: {
        type: Address,
        required: true,
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    deliveryTime: {
        type: String,
        required: true,
    },
    deliveryInstructions: {
        type: String,
    },
    customerNotes: {
        type: String,
    },
    orderSource: {
        type: String,
        enum: ['website', 'mobile_app'],
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
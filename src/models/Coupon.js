const User = require('./User');
const mongoose = require('mongoose');
const Product = require('./Product');

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: [true, 'Coupon code already exists']
    },
    type: {
        type: String,
        required: true,
        enum: ['discount', 'free_shipping', 'free_item']
    },
    discount: {
        type: Number,
        min: [0, 'Discount value must be greater than or equal to 0'],
        max: [100, 'Discount value must be less than or equal to 100'],
        required: function () {
            return this.type === 'discount';
        }
    },
    max_usage: {
        type: Number,
        default: 1
    },
    valid_until: {
        type: Date,
        required: [true, 'Coupon expiry date is required']
    },
    valid_for: {
        type: String,
        required: [true, 'Coupon valid for is required'],
        enum: ['first_order', 'all_orders', 'specific_products', 'specific_categories', 'specific_users'],
    },
    users: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        required: function () {
            return this.valid_for === 'specific_users';
        }
    },
    products: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        required: function () {
            return this.valid_for === 'specific_products';
        }
    },
    categories: {
        type: [{
            type: String,
        }],
        required: function () {
            return this.valid_for === 'specific_categories';
        }
    },
}, {
    timestamps: true
});

const Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;
const Car = require('./Car');
const Review = require('./review');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    itemCode: {
        type: String,
        index: true,
        trim: true,
        required: [true, 'Item code is required'],
        unique: [true, 'Item code must be unique'],
        minlength: [4, 'Item code must be at least 4 characters long'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: [true, 'Name must be trimmed'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: [true, 'Description must be trimmed'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0,
        validate: {
            validator: function (value) {
                return typeof value === 'number' && value > 0;
            },
            message: props => `${props.value} must be a positive number`
        }
    },
    rates: [{
        type: Number,
        min: 0,
        max: 5,
    }],
    image_URL: [{
        type: String,
        required: [true, 'At least one image URL is required'],
        validate: {
            validator: function (value) {
                return /^(http|https):\/\/[^ "]+$/.test(value);
            },
            message: props => `${props.value} is not a valid URL!`
        },
    }],
    quantityInStock: {
        type: Number,
        required: [true, 'Quantity in stock is required'],
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: props => `${props.value} must be a positive integer value`
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    compatibleCars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
    }],
    reviews: [Review.schema]
}, {
    timestamps: true
});

// Setting the toJSON option to include any virtual properties when data is requested
productSchema.set('toJSON', { virtuals: true });

// Adding the virtual field for average rating
productSchema.virtual('averageRating').get(function () {
    return this.rates.reduce((acc, val) => acc + val, 0) / this.rates.length;
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
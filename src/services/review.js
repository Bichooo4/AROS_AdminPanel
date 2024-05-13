const User = require('../models/User');
const Review = require('../models/review');
const Product = require('../models/Product');
const NotFound = require('../errors/NotFound');

const reviewServices = {
    addReview: async (productID, reviewData) => {
        try {
            const { userID, comment } = reviewData;

            const user = await User.findById(userID);
            if (!user) {
                throw new NotFound('User not found');
            }

            const product = await Product.findById(productID);
            if (!product) {
                throw new NotFound('Product not found');
            }

            const review = new Review({ user_id: userID, comment });
            await review.save();

            product.reviews.push(review);
            await product.save();

            return review;
        } catch (error) {
            throw error;
        }
    },
    deleteReview: async (productID, reviewID) => {
        try {
            const product = await Product.findById(productID);
            if (!product) {
                throw new NotFound('Product not found');
            }

            const review = await Review.findById(reviewID);
            if (!review) {
                throw new NotFound('Review not found');
            }

            await review.remove();

            product.reviews = product.reviews.filter(rev => rev.toString() !== reviewID);

            await product.save();
        } catch (error) {
            throw error;
        }
    },
    editReview: async (productID, reviewID, reviewData) => {
        try {
            const { comment } = reviewData;

            const product = await Product.findById(productID);
            if (!product) {
                throw new NotFound('Product not found');
            }

            const review = await Review.findById(reviewID);
            if (!review) {
                throw new NotFound('Review not found');
            }

            review.comment = comment;
            await review.save();

            return review;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = reviewServices;
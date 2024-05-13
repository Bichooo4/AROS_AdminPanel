const reviewServices = require('../services/review');

const reviewControllers = {
    addReview: async (req, res, next) => {
        try {
            const productId = req.params.id;
            const { userID, comment } = req.body;
            const reviewData = { userID, comment };

            const review = await reviewServices.addReview(productId, reviewData);

            res.status(201).json({
                status: 'success',
                message: 'Review added successfully',
                review,
            });
        } catch (error) {
            next(error);
        }
    },
    deleteReview: async (req, res, next) => {
        try {
            const { productId, reviewId } = req.params;

            await reviewServices.deleteReview(productId, reviewId);

            res.status(200).json({
                status: 'success',
                message: 'Review deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    },
    editReview: async (req, res, next) => {
        try {
            const { productId, reviewId } = req.params;
            const { comment } = req.body;
            const reviewData = { comment };

            const review = await reviewServices.editReview(productId, reviewId, reviewData);

            res.status(200).json({
                status: 'success',
                message: 'Review edited successfully',
                review,
            });

        } catch (error) {
            next(error);
        }
    },
};

module.exports = reviewControllers;
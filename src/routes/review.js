const express = require('express');
const auth = require('../middlewares/auth');
const reviewController = require('../controllers/review');
const { validateReviewDataMiddleware } = require('../validation/reviewSchema');

// Create a new Router
const router = express.Router();

/***************************************************Endpoint for customers **********************************************************/
//Add a review to a product
router.post('/product/addReview/:id', auth, validateReviewDataMiddleware, reviewController.addReview);

// Delete a review from a product
router.delete('/product/deleteReview/:productId/:reviewId', auth, reviewController.deleteReview);

// Edit a review of a product
router.patch('/product/editReview/:productId/:reviewId', auth, reviewController.editReview);

module.exports = router;
const express = require('express');
const auth = require('../middlewares/auth');
const feedbackControllers = require('../controllers/feedback');
const { validateFeedbackData } = require('../validation/feedbackSchema');

// Create a new Router
const router = express.Router();

/***************************************************Endpoint for customers*************************************************************/

// Add new feedback
router.post('/feedback', validateFeedbackData, feedbackControllers.addFeedback);

/***************************************************Endpoint for admins ****************************************************************/
// Get all feedbacks
router.get('/feedbacks', auth, feedbackControllers.getAllFeedbacks);

// Get feedback by ID
router.get('/feedback/:id', auth, feedbackControllers.getFeedbackById);

// Delete feedback by ID
router.delete('/feedback/:id', auth, feedbackControllers.deleteFeedbackById);

// Highlight feedback by ID
router.patch('/feedback/:id', auth, feedbackControllers.highlightFeedbackById);

module.exports = router;
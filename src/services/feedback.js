const Feedback = require('../models/Feedback');
const NotFound = require('../errors/NotFound');

const feedbackServices = {
    addFeedback: async (feedbackData) => {
        try {
            const feedback = new Feedback(feedbackData);
            const savedFeedback = await feedback.save();

            if (!savedFeedback) {
                throw new Error('Something went wrong while saving feedback');
            }

            return savedFeedback;
        } catch (error) {
            throw error;
        }
    },

    getAllFeedbacks: async () => {
        try {
            const feedbacks = await Feedback.find();

            if (!feedbacks || feedbacks.length === 0) {
                throw new NotFound('there is no feedbacks in the database');
            }

            return feedbacks;
        } catch (error) {
            throw error;
        }
    },

    getFeedbackById: async (id) => {
        try {
            const feedback = await Feedback.findById(id);

            if (!feedback) {
                throw new NotFound('Feedback not found');
            }

            return feedback;
        } catch (error) {
            throw error;
        }
    },

    deleteFeedbackById: async (id) => {
        try {
            const deletedFeedback = await Feedback.findByIdAndDelete(id);

            if (!deletedFeedback) {
                throw new NotFound('Feedback not found');
            }

            return;
        } catch (error) {
            throw error;
        }
    },

    highlightFeedbackById: async (id) => {
        try {
            const updatedFeedback = await Feedback.findByIdAndUpdate(id, { highlighted: true }, { new: true });

            if (!updatedFeedback) {
                throw new NotFound('Feedback not found');
            }

            return updatedFeedback;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = feedbackServices;
const Forbidden = require('../errors/Forbidden');
const feedbackServices = require('../services/feedback');

const feedbackControllers = {
    addFeedback: async (req, res, next) => {
        try {
            const feedbackData = req.body;
            const savedFeedback = await feedbackServices.addFeedback(feedbackData);

            res.status(201).json({
                status: 'success',
                message: 'Feedback added successfully to database',
                data: savedFeedback,
            });

        } catch (error) {
            next(error);
        }
    },

    getAllFeedbacks: async (req, res, next) => {
        try {
            const role = req.user.role;

            if (role === 'customer') {
                throw new Forbidden('You are not allowed to perform this action');
            }

            const feedbacks = await feedbackServices.getAllFeedbacks();

            res.status(200).json({
                status: 'success',
                message: 'All feedbacks fetched successfully',
                data: feedbacks
            });

        } catch (error) {
            next(error);
        }
    },

    getFeedbackById: async (req, res, next) => {
        try {
            const role = req.user.role;
            const feedbackId = req.params.id;

            if (role === 'customer') {
                throw new Forbidden('You are not allowed to perform this action');
            }

            const feedback = await feedbackServices.getFeedbackById(feedbackId);

            res.status(200).json({
                status: 'success',
                message: 'Feedback fetched successfully',
                data: feedback
            });

        } catch (error) {
            next(error);
        }
    },

    deleteFeedbackById: async (req, res, next) => {
        try {
            const role = req.user.role;
            const feedbackId = req.params.id;

            if (role === 'customer') {
                throw new Forbidden('You are not allowed to perform this action');
            }

            const deletedFeedback = await feedbackServices.deleteFeedbackById(feedbackId);

            res.status(200).json({
                status: 'success',
                message: 'Feedback deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    },

    highlightFeedbackById: async (req, res, next) => {
        try {
            const role = req.user.role;
            const feedbackId = req.params.id;

            if (role === 'customer') {
                throw new Forbidden('You are not allowed to perform this action');
            }

            const updatedFeedback = await feedbackServices.highlightFeedbackById(feedbackId);

            res.status(200).json({
                status: 'success',
                message: 'Feedback highlighted successfully',
                data: updatedFeedback
            });

        } catch (error) {
            next(error);
        }
    },
};

module.exports = feedbackControllers;
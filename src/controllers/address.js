const Forbidden = require('../errors/Forbidden');
const addressServices = require('../services/address');

const addressControllerss = {
    addAddress: async (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    },

    getAddresses: async (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    },

    getAddress: async (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    },

    updateAddress: async (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    },

    deleteAddress: async (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    },

    getAllAddresses: async (req, res, next) => {
        try {
            const role = req.user.role;

            if (role !== 'admin' || role !== 'staff') {
                throw new Forbidden('You are not authorized to access this resource');
            }

            const addresses = await addressServices.getAllAddresses();

            res.status(200).json({
                status: 'success',
                message: 'All Addresses in database retrieved successfully',
                data: addresses,
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = addressControllerss;
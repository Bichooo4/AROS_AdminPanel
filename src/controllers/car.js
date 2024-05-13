const carServices = require('../services/car');
const checkUserRole = require('../helpers/UserRole');

const carControllers = {
    addNewCar: async (req, res, next) => {
        try {
            // Check if the user is a staff
            checkUserRole('staff')(req, res, next);

            const { brand, model, productionYear } = req.body;
            const carData = {
                brand,
                model,
                productionYear,
            };

            const savedCar = await carServices.addCar(carData);

            res.status(201).json({
                status: 'success',
                message: 'Car added successfully to database',
                data: savedCar,
            });
        } catch (error) {
            next(error);
        }
    },
    deleteCarById: async (req, res, next) => {
        try {
            // Check if the user is a staff
            checkUserRole('staff')(req, res, next);

            const { id } = req.params;
            const deletedCar = await carServices.deleteCarById(id);

            res.status(200).json({
                status: 'success',
                message: 'Car deleted successfully from database'
            });
        } catch (error) {
            next(error);
        }
    },
    getAllCars: async (req, res, next) => {
        try {
            const cars = await carServices.getAllCars();

            res.status(200).json({
                status: 'success',
                message: 'All cars fetched successfully',
                data: cars,
            });
        } catch (error) {
            next(error);
        }
    },
    addCarOwner: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { carId } = req.params;

            const updatedCar = await carServices.addCarOwner(carId, userId);

            res.status(200).json({
                status: 'success',
                message: 'Car owner added successfully',
                data: updatedCar,
            });
        } catch (error) {
            next(error);
        }
    },
    removeCarOwner: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { carId } = req.params;

            const updatedCar = await carServices.removeCarOwner(carId, userId);

            res.status(200).json({
                status: 'success',
                message: 'Car owner removed successfully',
                data: updatedCar,
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = carControllers;
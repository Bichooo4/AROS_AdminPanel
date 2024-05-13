const Car = require('../models/Car');
const NotFound = require('../errors/NotFound');

const carServices = {
    addCar: async (carData) => {
        try {
            const car = new Car(carData);
            const savedCar = await car.save();

            if (!savedCar) {
                throw new Error('Something went wrong while saving car');
            }

            return savedCar;
        } catch (error) {
            throw error;
        }
    },

    deleteCarById: async (id) => {
        try {
            const deletedCar = await Car.findByIdAndDelete(id);

            if (!deletedCar) {
                throw new Error('Something went wrong while deleting car');
            }

            return deletedCar;
        } catch (error) {
            throw error;
        }
    },

    getAllCars: async () => {
        try {
            const cars = await Car.find();

            if (!cars) {
                throw new NotFound('No cars found');
            }

            return cars;
        } catch (error) {
            throw error;
        }
    },

    addCarOwner: async (carId, userId) => {
        try {
            const car = await Car.findById(carId);

            if (!car) {
                throw new NotFound('Car not found');
            }

            car.owners.push(userId);
            const savedCar = await car.save();

            return savedCar;
        } catch (error) {
            throw error;
        }
    },

    removeCarOwner: async (carId, userId) => {
        try {
            const car = await Car.findById(carId);

            if (!car) {
                throw new NotFound('Car not found');
            }

            car.owners = car.owners.filter(ownerId => ownerId.toString() !== userId.toString());
            const savedCar = await car.save();

            return savedCar;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = carServices;
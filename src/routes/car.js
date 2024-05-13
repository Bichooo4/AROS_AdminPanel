const express = require('express');
const auth = require('../middlewares/auth');
const carControllers = require('../controllers/car');
const { validateCarDataMiddleware } = require('../validation/carSchema');

// Create a new Router
const router = express.Router();

/****************************************************Endpoint Routers*****************************************************************/
// Get all cars
router.get('/cars', carControllers.getAllCars);

// Delete car by ID
router.delete('/car/:id', auth, carControllers.deleteCarById);

// Add new user ID to the list of users who owned this car
router.patch('/cars/:carId/addOwner', auth, carControllers.addCarOwner);

// Remove user ID from the list of users who owned this car
router.patch('/cars/:carId/removeOwner', auth, carControllers.removeCarOwner);

// Add new car to the list
router.post('/car', auth, validateCarDataMiddleware, carControllers.addNewCar);

module.exports = router;
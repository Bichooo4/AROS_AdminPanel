const express = require('express');
const auth = require('../middlewares/auth');
const addressControllers = require('../controllers/address');
const { validateAddressDataMiddleware, validateAddressUpdatesMiddleware } = require('../validation/addressSchema');

// Create a new Router
const router = express.Router();

/***************************************************Endpoint for customers*************************************************************/

// Add new address to a customer
router.post('/address', auth, validateAddressDataMiddleware, addressControllers.addAddress);

// Get all addresses of a customer
router.get('/address', auth, addressControllers.getAddresses);

// Get a specific address of a customer
router.get('/address/:addressId', auth, addressControllers.getAddress);

// Update a specific address of a customer
router.patch('/address/:addressId', auth, addressControllers.updateAddress);

// Delete a specific address of a customer
router.delete('/address/:addressId', auth, addressControllers.deleteAddress);

/***************************************************Endpoint for admins*************************************************************/

// Get all addresses
router.get('/addresses', auth, addressControllers.getAllAddresses);

module.exports = router;
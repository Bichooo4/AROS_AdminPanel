const express = require('express');
const auth = require('../middlewares/auth');
const userControllers = require('../controllers/user');
const { validateUserDataMiddleware, validateUserUpdatesMiddleware } = require('../validation/userSchema');

// Create a new Router
const router = express.Router();

/***************************************************Endpoint for customers & staff ****************************************************/
router.post('/logout', auth, userControllers.logout);

router.post('/logoutAll', auth, userControllers.logoutAll);

router.post('/login', validateUserUpdatesMiddleware, userControllers.login);

/***************************************************Endpoint for customers only********************************************************/
router.post('/register', validateUserDataMiddleware, userControllers.register);

/***************************************************Endpoint for staff only************************************************************/
router.post('/register/staff', validateUserDataMiddleware, userControllers.registerStaff);

module.exports = router;
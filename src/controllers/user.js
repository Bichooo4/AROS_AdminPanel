const userServices = require('../services/user');
const authHelpers = require('../helpers/utils');
const BadRequest = require('../errors/BadRequest');

const userControllers = {
    register: async (req, res, next) => {
        try {
            let { name, email, password, phone } = req.body;

            // Check if user with the same email already exists
            const userAlreadyExist = await userServices.getUserByEmail(email);
            if (userAlreadyExist) {
                throw new BadRequest('User with the same email already exists');
            }

            // Hash the password before saving it to the database
            password = await authHelpers.hashPassword(password);

            // Prepare user data for registration
            const userData = {
                name,
                email,
                password,
                phone,
                role: 'customer',
            };

            // Register the user
            const user = await userServices.register(userData);

            // Generate token after user registration
            const token = authHelpers.generateToken(user);

            // Save the token to the user document in the database
            await userServices.saveToken(user._id, token);

            // Respond with success message and user data
            res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    },
    registerStaff: async (req, res, next) => {
        try {
            let { name, email, password, phone } = req.body;

            // Check if user with the same email already exists
            const userAlreadyExist = await userServices.getUserByEmail(email);
            if (userAlreadyExist) {
                throw new BadRequest('User with the same email already exists');
            }

            // Hash the password before saving it to the database
            password = await authHelpers.hashPassword(password);

            // Prepare user data for registration
            const userData = {
                name,
                email,
                password,
                phone,
                role: 'staff',
            };

            // Register the user
            const user = await userServices.register(userData);

            // Respond with success message and user data
            res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                data: {
                    user
                }
            });
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await userServices.login(email, password);

            // Generate token & save it to the user document after successful login
            const token = authHelpers.generateToken(user);
            await userServices.saveToken(user._id, token);

            // Respond with success message and user data
            res.status(200).json({
                status: 'success',
                message: 'User logged in successfully',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    },
    logout: async (req, res, next) => {
        try {
            const user = req.user;
            const token = req.header('Authorization').split(' ')[1];

            // Remove the token from the user document in the database
            await userServices.removeToken(user.id, token);

            // Respond with success message
            res.status(200).json({
                status: 'success',
                message: 'User logged out successfully'
            });
        } catch (error) {
            next(error);
        }
    },
    logoutAll: async (req, res, next) => {
        try {
            const user = req.user;

            // Remove all tokens from the user document in the database
            await userServices.removeAllTokens(user.id);

            // Respond with success message
            res.status(200).json({
                status: 'success',
                message: 'User logged out from all devices successfully'
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = userControllers;
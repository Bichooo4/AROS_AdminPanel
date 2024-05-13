const User = require('../models/User');
const NotFound = require('../errors/NotFound');
const authHelpers = require('../helpers/utils');
const BadRequest = require('../errors/BadRequest');

const userServices = {
    register: async (userData) => {
        try {
            const user = await User.create(userData);

            if (!user) {
                throw new Error('Something went wrong while registering user account');
            }

            return user;
        } catch (error) {
            throw error;
        }
    },
    getUserByEmail: async (email) => {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return null;
            }

            return user;
        } catch (error) {
            throw error;
        }
    },
    saveToken: async (userId, token) => {
        try {
            const user = await User.findById(userId);

            if (!user) {
                throw new NotFound('User not found');
            }

            user.tokens = user.tokens.concat({ token });
            const savedUser = await user.save();

            if (!savedUser) {
                throw new Error('Something went wrong while saving token to user document');
            }


            return;
        } catch (error) {
            throw error;
        }
    },
    login: async (email, password) => {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                throw new NotFound('User not found');
            }

            const isMatch = await authHelpers.verifyPassword(password, user.password);

            if (!isMatch) {
                throw new BadRequest('Invalid email or password');
            }

            return user;
        } catch (error) {
            throw error;
        }
    },
    removeToken: async (userId, token) => {
        try {
            const user = await User.findById(userId);

            if (!user) {
                throw new NotFound('User not found');
            }

            user.tokens = user.tokens.filter((t) => t.token !== token);
            const savedUser = await user.save();

            if (!savedUser) {
                throw new Error('Something went wrong while removing token from user document');
            }

            return;
        } catch (error) {
            throw error;
        }
    },
    removeAllTokens: async (userId) => {
        try {
            const user = await User.findById(userId);

            if (!user) {
                throw new NotFound('User not found');
            }

            user.tokens = [];
            const savedUser = await user.save();

            if (!savedUser) {
                throw new Error('Something went wrong while removing all tokens from user document');
            }

            return;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = userServices;
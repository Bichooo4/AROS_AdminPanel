const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper functions for authentication
const authHelpers = {
    // hash password before saving to database
    hashPassword: async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    },

    // Generate JWT token for user
    generateToken: (user) => {
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
        );
        return token;
    },

    // Verify hashed password
    verifyPassword: async (password, hashedPassword) => {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    },
};

module.exports = authHelpers;
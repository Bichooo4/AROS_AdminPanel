const jwt = require('jsonwebtoken');
const unauthorized = require('../errors/unauthorized');

// auth middleware function for protecting routes
const auth = (req, res, next) => {
    // Check if the Authorization header is set in the request and correctly formatted
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new unauthorized('Authorization token is missing or invalid'));
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;
        next();
    } catch (error) {
        // Pass the error to the next middleware for handling
        next(new unauthorized('Invalid token'));
    }
};

module.exports = auth;

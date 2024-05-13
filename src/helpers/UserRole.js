const Forbidden = require('../errors/Forbidden');

const checkUserRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        // Check if the user is not the specified role
        if (userRole!== role) {
            throw new Forbidden('You are not allowed to perform this action');
        }
        next();
    };
};

module.exports = checkUserRole;

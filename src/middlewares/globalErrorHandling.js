const NotFound = require("../errors/NotFound");
const Forbidden = require("../errors/Forbidden");
const BadRequest = require("../errors/BadRequest");
const unauthorized = require("../errors/unauthorized");

const errorHandlingMiddleware = (err, req, res, next) => {
    if (err instanceof BadRequest) {
        return res.status(err.statusCode).json({ error: err.name, message: err.message });
    }

    if (err instanceof Forbidden) {
        return res.status(err.status).json({ error: err.name, message: err.message });
    }

    if (err instanceof NotFound) {
        return res.status(err.status).json({ error: err.name, message: err.message });
    }

    if (err instanceof unauthorized) {
        return res.status(err.status).json({ error: err.name, message: err.message });
    }

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({ error: 'Bad Request', message: 'Invalid ObjectId value provided' });
    }

    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred.' });
};

module.exports = errorHandlingMiddleware;
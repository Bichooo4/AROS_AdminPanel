class BadRequest extends Error {
    constructor(message) {
        super(message);
        this.name = 'Bad_request';
        this.statusCode = 400;
    }
}

module.exports = BadRequest;
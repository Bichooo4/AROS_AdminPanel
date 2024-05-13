class NotFound extends Error {
    constructor(message) {
        super(message);
        this.name = 'Not_found';
        this.status = 404;
    }
}

module.exports = NotFound;
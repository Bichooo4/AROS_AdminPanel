class unauthorized extends Error {
    constructor(message) {
        super(message);
        this.name = 'unauthorized';
        this.status = 401;
    }
};

module.exports = unauthorized;
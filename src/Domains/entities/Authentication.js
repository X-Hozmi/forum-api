class Authentication {
    constructor(token) {
        if (!token) {
            throw new Error('AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof token !== 'string') {
            throw new Error('AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        this.token = token;
    }
}

module.exports = Authentication;

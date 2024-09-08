class User {
    constructor(id, username, password, fullname) {
        if (!id || !username || !password || !fullname) {
            throw new Error('USER.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
            throw new Error('USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        this.id = id;
        this.username = username;
        this.password = password;
        this.fullname = fullname;
    }
}

module.exports = User;

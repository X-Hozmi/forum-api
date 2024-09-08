class Thread {
    constructor(id, userId, title, body) {
        if (!id || !userId || !title || !body) {
            throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof userId !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        this.id = id;
        this.userId = userId;
        this.title = title;
        this.body = body;
    }
}

module.exports = Thread;

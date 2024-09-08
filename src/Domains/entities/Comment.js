class Comment {
    constructor(id, threadId, userId, content, isDelete) {
        if (!id || !threadId || !userId || !content) {
            throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof threadId !== 'string' || typeof userId !== 'string' || typeof content !== 'string' || typeof isDelete !== 'boolean') {
            throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        this.id = id;
        this.threadId = threadId;
        this.userId = userId;
        this.content = content;
        this.isDelete = isDelete;
    }
}

module.exports = Comment;

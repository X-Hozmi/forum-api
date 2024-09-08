class Reply {
    constructor(id, commentId, userId, content, isDelete) {
        if (!id || !commentId || !userId || !content) {
            throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof commentId !== 'string' || typeof userId !== 'string' || typeof content !== 'string' || typeof isDelete !== 'boolean') {
            throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        this.id = id;
        this.commentId = commentId;
        this.userId = userId;
        this.content = content;
        this.isDelete = isDelete;
    }
}

module.exports = Reply;

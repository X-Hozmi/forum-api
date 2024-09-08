class DetailThreadUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(threadId) {
        await this._threadRepository.verifyAvailableThreadById(threadId);
        const thread = await this._threadRepository.getThreadById(threadId);
        const comments = await this._commentRepository.getCommentsInAThread(threadId);
        const replies = await this._replyRepository.getRepliesInAThread(threadId);
        const commentsWithReplies = this._mergeRepliesIntoComments(comments, replies);
        return {
            ...thread,
            comments: commentsWithReplies,
        };
    }

    _mergeRepliesIntoComments(comments, replies) {
        const commentMap = comments.reduce((map, comment) => {
            const { isDelete, ...commentData } = comment;
            map[comment.id] = { /* eslint-disable-line no-param-reassign */
                ...commentData,
                content: isDelete ? '**komentar telah dihapus**' : comment.content,
                replies: [],
            };
            return map;
        }, {});

        replies.forEach((reply) => {
            const { isDelete, commentId, ...replyData } = reply;
            if (commentMap[commentId]) {
                commentMap[commentId].replies.push({
                    ...replyData,
                    content: isDelete ? '**balasan telah dihapus**' : reply.content,
                });
            }
        });

        return Object.values(commentMap);
    }
}

module.exports = DetailThreadUseCase;

const DeleteReply = require('../../Domains/repositories/replies/entities/DeleteReply');

class DeleteReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        const {
            threadId, commentId, replyId, owner,
        } = new DeleteReply(useCasePayload);
        await this._threadRepository.verifyAvailableThreadById(threadId);
        await this._commentRepository.verifyAvailableCommentById(commentId);
        await this._replyRepository.verifyAvailableReplyById(replyId);
        await this._replyRepository.verifyReplyByOwner(replyId, owner);
        return this._replyRepository.deleteReply(replyId);
    }
}

module.exports = DeleteReplyUseCase;

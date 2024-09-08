const DeleteComment = require('../../Domains/repositories/comments/entities/DeleteComment');

class DeleteCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, owner } = new DeleteComment(useCasePayload);
        await this._threadRepository.verifyAvailableThreadById(threadId);
        await this._commentRepository.verifyAvailableCommentById(commentId);
        await this._commentRepository.verifyCommentByOwner(commentId, owner);
        await this._commentRepository.deleteComment(commentId);
    }
}

module.exports = DeleteCommentUseCase;

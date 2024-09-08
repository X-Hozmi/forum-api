const AddComment = require('../../Domains/repositories/comments/entities/AddComment');

class AddCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        await this._threadRepository.verifyAvailableThreadById(useCasePayload.threadId);
        const addComment = new AddComment(useCasePayload);
        return this._commentRepository.addComment(addComment);
    }
}

module.exports = AddCommentUseCase;

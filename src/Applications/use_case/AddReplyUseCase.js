const AddReply = require('../../Domains/repositories/replies/entities/AddReply');

class AddReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        await this._threadRepository.verifyAvailableThreadById(useCasePayload.threadId);
        await this._commentRepository.verifyAvailableCommentById(useCasePayload.commentId);
        const addReply = new AddReply(useCasePayload);
        return this._replyRepository.addReply(addReply);
    }
}

module.exports = AddReplyUseCase;

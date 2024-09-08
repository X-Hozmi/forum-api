const autoBind = require('auto-bind');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
    constructor(container) {
        this._container = container;

        autoBind(this);
    }

    async postReplyHandler(request, h) {
        const { id } = request.auth.credentials;
        const { threadId, commentId } = request.params;
        const { content } = request.payload;
        const replyPayload = {
            threadId, commentId, owner: id, content,
        };
        const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
        const addedReply = await addReplyUseCase.execute(replyPayload);

        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    async deleteReplyHandler(request, h) {
        const { id } = request.auth.credentials;
        const { threadId, commentId, replyId } = request.params;
        const replyPayload = {
            threadId, commentId, replyId, owner: id,
        };
        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
        await deleteReplyUseCase.execute(replyPayload);

        const response = h.response({ status: 'success' });
        response.code(200);
        return response;
    }
}

module.exports = RepliesHandler;

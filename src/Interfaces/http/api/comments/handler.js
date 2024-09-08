const autoBind = require('auto-bind');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
    constructor(container) {
        this._container = container;

        autoBind(this);
    }

    async postCommentHandler(request, h) {
        const { id } = request.auth.credentials;
        const { threadId } = request.params;
        const { content } = request.payload;
        const commentPayload = { threadId, owner: id, content };
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const addedComment = await addCommentUseCase.execute(commentPayload);

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentHandler(request, h) {
        const { id } = request.auth.credentials;
        const { threadId, commentId } = request.params;
        const commentPayload = { threadId, commentId, owner: id };
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        await deleteCommentUseCase.execute(commentPayload);

        const response = h.response({ status: 'success' });
        response.code(200);
        return response;
    }
}

module.exports = CommentsHandler;

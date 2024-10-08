const autoBind = require('auto-bind');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/DetailThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        autoBind(this);
    }

    async postThreadHandler(request, h) {
        const { id } = request.auth.credentials;
        const { title, body } = request.payload;
        const threadPayload = { title, body, owner: id };
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute(threadPayload);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadHandler(request, h) {
        const { threadId } = request.params;
        const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
        const detailThread = await detailThreadUseCase.execute(threadId);

        const response = h.response({
            status: 'success',
            data: { thread: detailThread },
        });
        response.code(200);
        return response;
    }
}

module.exports = ThreadsHandler;

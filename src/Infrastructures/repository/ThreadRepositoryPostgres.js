const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/repositories/threads/ThreadRepository');
const AddedThread = require('../../Domains/repositories/threads/entities/AddedThread');
const { UserModel } = require('../orm/index');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(threadModel, idGenerator) {
        super();
        this._threadModel = threadModel;
        this._idGenerator = idGenerator;
    }

    async addThread(thread) {
        const id = `thread-${this._idGenerator()}`;
        const { owner, title, body } = thread;

        const threadRecord = await this._threadModel.create({
            id, userId: owner, title, body,
        });

        return new AddedThread({
            id: threadRecord.id,
            owner: threadRecord.userId,
            title: threadRecord.title,
        });
    }

    async verifyAvailableThreadById(id) {
        const threadRecord = await this._threadModel.findOne({
            where: { id },
        });

        if (threadRecord === null) throw new NotFoundError('thread tidak ditemukan');
    }

    async getThreadById(id) {
        const thread = await this._threadModel.findOne({
            where: { id },
        });

        const user = await UserModel.findOne({
            where: { id: thread.userId },
        });

        return {
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: thread.createdAt.toISOString(),
            username: user.username,
        };
    }
}

module.exports = ThreadRepositoryPostgres;

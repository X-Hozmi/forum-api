const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const ReplyRepository = require('../../Domains/repositories/replies/ReplyRepository');
const AddedReply = require('../../Domains/repositories/replies/entities/AddedReply');
const { UserModel, CommentModel } = require('../orm/index');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(replyModel, idGenerator) {
        super();
        this._replyModel = replyModel;
        this._idGenerator = idGenerator;
    }

    async addReply(reply) {
        const id = `reply-${this._idGenerator()}`;
        const { commentId, owner, content } = reply;

        const replyRecord = await this._replyModel.create({
            id, commentId, userId: owner, content,
        });

        return new AddedReply({
            id: replyRecord.id,
            owner: replyRecord.userId,
            content: replyRecord.content,
        });
    }

    async verifyAvailableReplyById(id) {
        const replyRecord = await this._replyModel.findOne({
            where: { id, isDelete: false },
        });

        if (replyRecord === null) throw new NotFoundError('balasan tidak ditemukan');
    }

    async verifyReplyByOwner(id, userId) {
        const replyRecord = await this._replyModel.findOne({
            where: { id, userId },
        });

        if (replyRecord === null) throw new AuthorizationError('balasan ini bukan milik anda');
    }

    async getRepliesInAThread(threadId) {
        const comments = await CommentModel.findAll({
            where: { threadId },
            attributes: ['id'],
        });

        if (comments.length === 0) {
            return [];
        }

        const commentIds = comments.map((comment) => comment.id);

        const replies = await this._replyModel.findAll({
            where: { commentId: commentIds },
            order: [['createdAt', 'ASC']],
        });

        if (replies.length === 0) {
            return [];
        }

        const userIds = replies.map((reply) => reply.userId);
        const users = await UserModel.findAll({
            where: {
                id: userIds,
            },
            attributes: ['id', 'username'],
        });

        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user.username;
            return acc;
        }, {});

        const repliesMap = replies.map((reply) => ({
            id: reply.id,
            commentId: reply.commentId,
            username: userMap[reply.userId],
            date: reply.createdAt.toISOString(),
            content: reply.content,
            isDelete: reply.isDelete,
        }));

        console.log('Replies In PG: ', repliesMap);
        return repliesMap;
    }

    async deleteReply(id) {
        await this._replyModel.update(
            { isDelete: 'true' },
            { where: { id } },
        );
    }
}

module.exports = ReplyRepositoryPostgres;

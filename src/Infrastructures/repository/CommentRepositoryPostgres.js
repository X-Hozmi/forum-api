const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/repositories/comments/CommentRepository');
const AddedComment = require('../../Domains/repositories/comments/entities/AddedComment');
const { UserModel } = require('../orm/index');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(commentModel, idGenerator) {
        super();
        this._commentModel = commentModel;
        this._idGenerator = idGenerator;
    }

    async addComment(comment) {
        const id = `comment-${this._idGenerator()}`;
        const { threadId, owner, content } = comment;

        const commentRecord = await this._commentModel.create({
            id, threadId, userId: owner, content,
        });

        return new AddedComment({
            id: commentRecord.id,
            owner: commentRecord.userId,
            content: commentRecord.content,
        });
    }

    async verifyAvailableCommentById(id) {
        const commentRecord = await this._commentModel.findOne({
            where: { id, isDelete: false },
        });

        if (commentRecord === null) throw new NotFoundError('komentar tidak ditemukan');
    }

    async verifyCommentByOwner(id, userId) {
        const commentRecord = await this._commentModel.findOne({
            where: { id, userId },
        });

        if (commentRecord === null) throw new AuthorizationError('komentar ini bukan milik anda');
    }

    async getCommentsInAThread(threadId) {
        const comments = await this._commentModel.findAll({
            where: { threadId },
            order: [['createdAt', 'ASC']],
        });

        if (comments.length === 0) {
            return [];
        }

        const userIds = comments.map((comment) => comment.userId);
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

        return comments.map((comment) => ({
            id: comment.id,
            username: userMap[comment.userId],
            date: comment.createdAt.toISOString(),
            content: comment.content,
            isDelete: comment.isDelete,
        }));
    }

    async deleteComment(id) {
        console.log('Going to Delete Comment');
        await this._commentModel.update(
            { isDelete: 'true' },
            { where: { id } },
        );
    }
}

module.exports = CommentRepositoryPostgres;

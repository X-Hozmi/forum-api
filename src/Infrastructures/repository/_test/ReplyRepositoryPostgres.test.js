const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const {
    UserModel, ThreadModel, CommentModel, ReplyModel,
} = require('../../orm/index');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddReply = require('../../../Domains/repositories/replies/entities/AddReply');
const AddedReply = require('../../../Domains/repositories/replies/entities/AddedReply');

describe('ReplyRepositoryPostgres', () => {
    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await ReplyModel.sequelize.close();
        await CommentModel.sequelize.close();
        await ThreadModel.sequelize.close();
        await UserModel.sequelize.close();
    });

    describe('addReply function', () => {
        it('should persist add reply and return added reply correctly', async () => {
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, userId, threadId });

            const addReply = new AddReply({
                commentId,
                owner: userId,
                content: 'Reply',
            });

            const fakeIdGenerator = () => '123'; // stub!
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(ReplyModel, fakeIdGenerator);

            // Action
            const addedReply = await replyRepositoryPostgres.addReply(addReply);

            // Assert
            const reply = await RepliesTableTestHelper.findReplyById(addedReply.id);
            expect(reply).toHaveLength(1);
            expect(addedReply).toStrictEqual(new AddedReply({
                id: `reply-${fakeIdGenerator()}`,
                owner: addReply.owner,
                content: addReply.content,
            }));
        });
    });

    describe('verifyAvailableReplyById function', () => {
        it('should throw NotFoundError when reply not found', async () => {
            // Arrange
            const replyId = 'reply-170';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(ReplyModel, {});

            // Action & Assert
            await expect(replyRepositoryPostgres.verifyAvailableReplyById(replyId))
                .rejects.toThrow(NotFoundError);
        });

        it('shouldn\'t throw NotFoundError when reply found', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const replyId = 'reply-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, userId, threadId });
            await RepliesTableTestHelper.addReply({ id: replyId, commentId });

            const fakeIdGenerator = () => '123'; // stub!
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(ReplyModel, fakeIdGenerator);

            // Action & Assert
            await expect(replyRepositoryPostgres.verifyAvailableReplyById(replyId))
                .resolves.not.toThrow(NotFoundError);
        });
    });

    describe('verifyReplyByOwner function', () => {
        it('should throw AuthorizationError when isn\'t the owner', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const replyId = 'reply-123';
            const invalidUserId = 'user-170';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, userId, threadId });
            await RepliesTableTestHelper.addReply({ id: replyId, commentId });

            const commentRepositoryPostgres = new ReplyRepositoryPostgres(ReplyModel, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyReplyByOwner(replyId, invalidUserId))
                .rejects.toThrow(AuthorizationError);
        });

        it('shouldn\'t throw AuthorizationError when it\'s the owner', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const replyId = 'reply-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, userId, threadId });
            await RepliesTableTestHelper.addReply({ id: replyId, commentId });

            const fakeIdGenerator = () => '123'; // stub!

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(ReplyModel, fakeIdGenerator);

            // Action & Assert
            await expect(replyRepositoryPostgres.verifyReplyByOwner(replyId, userId))
                .resolves.not.toThrow(AuthorizationError);
        });
    });

    describe('getRepliesInAThread function', () => {
        it('should return an empty array if no comments are found by thread ID', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });

            const fakeIdGenerator = () => '123'; // stub!
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(ReplyModel, fakeIdGenerator);

            // Action
            const comments = await replyRepositoryPostgres.getRepliesInAThread(threadId);

            // Assert
            expect(comments).toBeDefined();
            expect(comments).toHaveLength(0);
        });

        it('should return an empty array if no replies are found by thread ID', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId });

            const fakeIdGenerator = () => '123'; // stub!
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(ReplyModel, fakeIdGenerator);

            // Action
            const replies = await replyRepositoryPostgres.getRepliesInAThread(threadId);

            // Assert
            expect(replies).toBeDefined();
            expect(replies).toHaveLength(0);
        });

        it('should get replies by thread ID correctly', async () => {
            // Arrange
            const userId = 'user-123';
            const username = 'dicoding';
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const replyId = 'reply-123';

            await UsersTableTestHelper.addUser({ id: userId, username });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId });
            await RepliesTableTestHelper.addReply({ id: replyId, commentId, userId });

            const fakeIdGenerator = () => '123'; // stub!
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(ReplyModel, fakeIdGenerator);

            // Action
            const replies = await replyRepositoryPostgres.getRepliesInAThread(threadId);

            // Assert
            expect(replies).toBeDefined();
            expect(replies).toHaveLength(1);
            expect(replies[0].id).toEqual(replyId);
            expect(replies[0].username).toEqual(username);
            expect(replies[0].content).toEqual('Reply');
            expect(replies[0].isDelete).toEqual(false);
        });
    });

    describe('deleteReply function', () => {
        // it('should throw NotFoundError when reply not found', () => {
        //     // Arrange
        //     const replyRepositoryPostgres = new ReplyRepositoryPostgres(ReplyModel, {});

        //     // Action & Assert
        //     return expect(replyRepositoryPostgres.deleteReply('reply-170'))
        //         .rejects
        //         .toThrowError(NotFoundError);
        // });

        it('should delete reply correctly', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const replyId = 'reply-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId });
            await RepliesTableTestHelper.addReply({ id: replyId, commentId, userId });

            const fakeIdGenerator = () => '123'; // stub!
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(ReplyModel, fakeIdGenerator);

            // Action
            await replyRepositoryPostgres.deleteReply(replyId);

            // Assert
            const replyResult = await RepliesTableTestHelper.findReplyById(replyId);
            expect(replyResult).toBeDefined();
            expect(replyResult).toHaveLength(1);
            expect(replyResult[0].isDelete).toEqual(true);
        });
    });
});

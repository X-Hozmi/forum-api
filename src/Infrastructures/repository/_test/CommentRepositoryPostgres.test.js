const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const { UserModel, ThreadModel, CommentModel } = require('../../orm/index');
const AddComment = require('../../../Domains/repositories/comments/entities/AddComment');
const AddedComment = require('../../../Domains/repositories/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await CommentModel.sequelize.close();
        await ThreadModel.sequelize.close();
        await UserModel.sequelize.close();
    });

    describe('addComment function', () => {
        it('should persist add comment and return added comment correctly', async () => {
            const userId = 'user-123';
            const threadId = 'thread-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });

            const addComment = new AddComment({
                threadId,
                owner: userId,
                content: 'Comment',
            });

            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(CommentModel, fakeIdGenerator);

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(addComment);

            // Assert
            const comment = await CommentsTableTestHelper.findCommentById(addedComment.id);
            expect(comment).toHaveLength(1);
            expect(addedComment).toStrictEqual(new AddedComment({
                id: `comment-${fakeIdGenerator()}`,
                owner: addComment.owner,
                content: addComment.content,
            }));
        });
    });

    describe('verifyAvailableCommentById function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            const commentId = 'comment-170';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(CommentModel, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyAvailableCommentById(commentId))
                .rejects.toThrow(NotFoundError);
        });

        it('shouldn\'t throw NotFoundError when comment found', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, userId, threadId });

            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(CommentModel, fakeIdGenerator);

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyAvailableCommentById(commentId))
                .resolves.not.toThrow(NotFoundError);
        });
    });

    describe('verifyCommentByOwner function', () => {
        it('should throw AuthorizationError when isn\'t the owner', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const invalidUserId = 'user-170';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, userId, threadId });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(CommentModel, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentByOwner(commentId, invalidUserId))
                .rejects.toThrow(AuthorizationError);
        });

        it('shouldn\'t throw AuthorizationError when it\'s the owner', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, userId, threadId });

            const fakeIdGenerator = () => '123'; // stub!

            const commentRepositoryPostgres = new CommentRepositoryPostgres(CommentModel, fakeIdGenerator);

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentByOwner(commentId, userId))
                .resolves.not.toThrow(AuthorizationError);
        });
    });

    describe('getCommentsInAThread function', () => {
        it('should show empty array if no comment found by thread ID', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId });

            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(CommentModel, fakeIdGenerator);

            // Action
            const comments = await commentRepositoryPostgres.getCommentsInAThread(threadId);

            // Assert
            expect(comments).toBeDefined();
            expect(comments).toHaveLength(0);
        });

        it('should get comments by thread ID correctly', async () => {
            // Arrange
            const userId = 'user-123';
            const username = 'user123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            await UsersTableTestHelper.addUser({ id: userId, username });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId });

            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(CommentModel, fakeIdGenerator);

            // Action
            const comments = await commentRepositoryPostgres.getCommentsInAThread(threadId);

            // Assert
            expect(comments).toBeDefined();
            expect(comments).toHaveLength(1);
            expect(comments[0].id).toEqual(commentId);
            expect(comments[0].username).toEqual(username);
            expect(comments[0].content).toEqual('Content');
            expect(comments[0].isDelete).toEqual(false);
        });
    });

    describe('deleteComment function', () => {
        // it('should throw NotFoundError when comment not found', () => {
        //     // Arrange
        //     const commentRepositoryPostgres = new CommentRepositoryPostgres(CommentModel, {});

        //     // Action & Assert
        //     return expect(commentRepositoryPostgres.deleteComment('comment-170'))
        //         .rejects
        //         .toThrowError(NotFoundError);
        // });

        it('should delete comment correctly', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId });

            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(CommentModel, fakeIdGenerator);

            // Action
            await commentRepositoryPostgres.deleteComment(commentId);

            // Assert
            const commentResult = await CommentsTableTestHelper.findCommentById(commentId);
            expect(commentResult).toBeDefined();
            expect(commentResult).toHaveLength(1);
            expect(commentResult[0].isDelete).toEqual(true);
        });
    });
});

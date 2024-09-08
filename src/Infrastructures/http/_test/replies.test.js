const {
    UserModel, ThreadModel, CommentModel, ReplyModel,
} = require('../../orm/index');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ServerInjectionHelper = require('../../../../tests/ServerInjectionHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    afterAll(async () => {
        await ReplyModel.sequelize.close();
        await CommentModel.sequelize.close();
        await ThreadModel.sequelize.close();
        await UserModel.sequelize.close();
    });

    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 201 and persisted reply', async () => {
            const requestPayload = {
                content: 'Content',
            };

            const server = await createServer(container);
            const { accessToken, owner } = await ServerInjectionHelper.generateAccessToken(server);

            const threadId = 'thread-123';
            const commentId = 'comment-123';
            await ThreadsTableTestHelper.addThread({ id: threadId, userId: owner });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId: owner });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {};

            const server = await createServer(container);
            const { accessToken, owner } = await ServerInjectionHelper.generateAccessToken(server);

            const threadId = 'thread-123';
            const commentId = 'comment-123';
            await ThreadsTableTestHelper.addThread({ id: threadId, userId: owner });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId: owner });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('properti yang dikirim kurang lengkap');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                content: 123,
            };

            const server = await createServer(container);
            const { accessToken, owner } = await ServerInjectionHelper.generateAccessToken(server);

            const threadId = 'thread-123';
            const commentId = 'comment-123';
            await ThreadsTableTestHelper.addThread({ id: threadId, userId: owner });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId: owner });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('data yang dikirim harus berupa string');
        });

        it('should response 401 status code when add reply without authentication', async () => {
            // Arrange
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const requestPayload = {
                content: 'Content',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.message).toEqual('Missing authentication');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should response 200 when reply is successfully deleted', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const replyId = 'reply-123';

            await UsersTableTestHelper.addUser({ id: userId, username: 'User123' });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });

            const server = await createServer(container);
            const { accessToken, owner } = await ServerInjectionHelper.generateAccessToken(server);

            await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId: owner });
            await RepliesTableTestHelper.addReply({ id: replyId, commentId, userId: owner });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 401 status code when delete reply without authentication', async () => {
            // Arrange
            const server = await createServer(container);

            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const replyId = 'reply-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId });
            await RepliesTableTestHelper.addReply({ id: replyId, commentId, userId });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 403 when user isn\'t an authorized owner of the reply', async () => {
            // Arrange
            const server = await createServer(container);
            const { accessToken, owner } = await ServerInjectionHelper.generateAccessToken(server);

            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const replyId = 'reply-123';
            const otherUserId = 'user-170';

            await UsersTableTestHelper.addUser({ id: otherUserId, username: 'User170' });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId: owner });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId: owner });
            await RepliesTableTestHelper.addReply({ id: replyId, commentId, userId: otherUserId });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('balasan ini bukan milik anda');
        });

        it('should response 404 when thread or reply doesn\'t exist', async () => {
            // Arrange
            const server = await createServer(container);
            const { accessToken } = await ServerInjectionHelper.generateAccessToken(server);

            const threadId = 'thread-170';
            const commentId = 'comment-170';
            const replyId = 'reply-170';

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toBeDefined();
        });
    });
});

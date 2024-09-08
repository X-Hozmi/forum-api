const {
    UserModel, ThreadModel, CommentModel,
} = require('../../orm/index');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerInjectionHelper = require('../../../../tests/ServerInjectionHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
    afterAll(async () => {
        await CommentModel.sequelize.close();
        await ThreadModel.sequelize.close();
        await UserModel.sequelize.close();
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and persisted comment', async () => {
            const requestPayload = {
                content: 'Content',
            };

            const server = await createServer(container);
            const { accessToken, owner } = await ServerInjectionHelper.generateAccessToken(server);

            const threadId = 'thread-123';
            await ThreadsTableTestHelper.addThread({ id: threadId, userId: owner });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {};

            const server = await createServer(container);
            const { accessToken, owner } = await ServerInjectionHelper.generateAccessToken(server);

            const threadId = 'thread-123';
            await ThreadsTableTestHelper.addThread({ id: threadId, userId: owner });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
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
            await ThreadsTableTestHelper.addThread({ id: threadId, userId: owner });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
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

        it('should response 401 status code when add comment without authentication', async () => {
            // Arrange
            const threadId = 'thread-123';
            const requestPayload = {
                content: 'Content',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.message).toEqual('Missing authentication');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200 when comment is successfully deleted', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            await UsersTableTestHelper.addUser({ id: userId, username: 'User123' });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });

            const server = await createServer(container);
            const { accessToken, owner } = await ServerInjectionHelper.generateAccessToken(server);

            await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId: owner });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 401 status code when delete comment without authentication', async () => {
            // Arrange
            const server = await createServer(container);

            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 403 when user isn\'t an authorized owner of the comment', async () => {
            // Arrange
            const server = await createServer(container);
            const { accessToken, owner } = await ServerInjectionHelper.generateAccessToken(server);

            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const otherUserId = 'user-170';

            await UsersTableTestHelper.addUser({ id: otherUserId, username: 'User170' });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId: owner });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId: otherUserId });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('komentar ini bukan milik anda');
        });

        it('should response 404 when thread or comment doesn\'t exist', async () => {
            // Arrange
            const server = await createServer(container);
            const { accessToken } = await ServerInjectionHelper.generateAccessToken(server);

            const threadId = 'thread-170';
            const commentId = 'comment-170';

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
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

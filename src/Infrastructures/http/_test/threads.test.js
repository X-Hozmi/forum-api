const {
    UserModel, ThreadModel,
} = require('../../orm/index');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ServerInjectionHelper = require('../../../../tests/ServerInjectionHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
    afterAll(async () => {
        await ThreadModel.sequelize.close();
        await UserModel.sequelize.close();
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const requestPayload = {
                title: 'Title',
                body: 'Body',
            };

            const server = await createServer(container);
            const { accessToken } = await ServerInjectionHelper.generateAccessToken(server);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                title: 'Title',
            };

            const server = await createServer(container);
            const { accessToken } = await ServerInjectionHelper.generateAccessToken(server);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
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
                owner: true,
                title: 123,
                body: ['Body'],
            };

            const server = await createServer(container);
            const { accessToken } = await ServerInjectionHelper.generateAccessToken(server);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
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

        it('should response 400 when request payload title is too long', async () => {
            // Arrange
            const requestPayload = {
                owner: 'user-123',
                title: 'TitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitle',
                body: 'Body',
            };

            const server = await createServer(container);
            const { accessToken } = await ServerInjectionHelper.generateAccessToken(server);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('judul terlalu panjang');
        });

        it('should response 401 status code when add thread without authentication', async () => {
            // Arrange
            const threadPayload = {
                owner: 'user-123',
                title: 'Title',
                body: 'Body',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.message).toEqual('Missing authentication');
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and show thread by id', async () => {
            // Arrange
            const userId = 'user-123';
            const threadId = 'thread-123';

            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, userId });

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
        });

        it('should response 404 when requested thread not found', async () => {
            // Arrange
            const threadId = 'thread-123';

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });
    });
});

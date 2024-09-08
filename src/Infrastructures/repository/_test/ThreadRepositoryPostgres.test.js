const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const { UserModel, ThreadModel } = require('../../orm/index');
const AddThread = require('../../../Domains/repositories/threads/entities/AddThread');
const AddedThread = require('../../../Domains/repositories/threads/entities/AddedThread');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await ThreadModel.sequelize.close();
        await UserModel.sequelize.close();
    });

    describe('addThread function', () => {
        it('should persist add thread and return added thread correctly', async () => {
            // Arrange
            const userId = 'user-123';

            await UsersTableTestHelper.addUser({ id: userId });

            const addThread = new AddThread({
                owner: userId,
                title: 'Title',
                body: 'Body',
            });

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(ThreadModel, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(addThread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById(addedThread.id);
            expect(threads).toHaveLength(1);
            expect(addedThread).toStrictEqual(new AddedThread({
                id: `thread-${fakeIdGenerator()}`,
                owner: addThread.owner,
                title: addThread.title,
            }));
        });
    });

    describe('verifyAvailableThreadById function', () => {
        it('should throw NotFoundError when thread not found', async () => {
            // Arrange
            const threadId = 'thread-170';

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(ThreadModel, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyAvailableThreadById(threadId))
                .rejects.toThrow(NotFoundError);
        });

        it('shouldn\'t throw NotFoundError when thread found', async () => {
            // Arrange
            const threadId = 'thread-123';

            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: threadId });

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(ThreadModel, fakeIdGenerator);

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyAvailableThreadById(threadId))
                .resolves.not.toThrow(NotFoundError);
        });
    });

    describe('getThreadById function', () => {
        it('should return thread by ID correctly', async () => {
            // Arrange
            const userData = {
                id: 'user-123',
                username: 'dicoding',
            };
            await UsersTableTestHelper.addUser(userData);

            const threadData = {
                id: 'thread-123',
                owner: 'user-123',
                title: 'Title',
                body: 'Body',
            };
            await ThreadsTableTestHelper.addThread(threadData);

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(ThreadModel, fakeIdGenerator);

            // Action
            const thread = await threadRepositoryPostgres.getThreadById(threadData.id);

            // Assert
            expect(thread).toBeDefined();
            expect(thread.id).toEqual(threadData.id);
            expect(thread.title).toEqual(threadData.title);
            expect(thread.body).toEqual(threadData.body);
            expect(thread.username).toEqual(userData.username);
        });
    });
});

const AddThread = require('../../../Domains/repositories/threads/entities/AddThread');
const AddedThread = require('../../../Domains/repositories/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/repositories/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            owner: 'user-123',
            title: 'secret',
            body: 'Dicoding Indonesia',
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation((addThread) => Promise.resolve(new AddedThread({
                id: 'thread-123',
                owner: addThread.owner,
                title: addThread.title,
            })));

        /** creating use case instance */
        const getThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await getThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(new AddedThread({
            id: 'thread-123',
            owner: useCasePayload.owner,
            title: useCasePayload.title,
        }));
        expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
            owner: useCasePayload.owner,
            title: useCasePayload.title,
            body: useCasePayload.body,
        }));
    });
});

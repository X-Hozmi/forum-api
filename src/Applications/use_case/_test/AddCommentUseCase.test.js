const AddComment = require('../../../Domains/repositories/comments/entities/AddComment');
const AddedComment = require('../../../Domains/repositories/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/repositories/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/repositories/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
    /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
    it('should orchestrating the add comment action correctly', async () => {
    // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            owner: 'user-123',
            content: 'Comment',
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockThreadRepository.verifyAvailableThreadById = jest.fn(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation((addComment) => Promise.resolve(new AddedComment({
                id: 'comment-123',
                content: addComment.content,
                owner: addComment.owner,
            })));

        /** creating use case instance */
        const getCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const addedComment = await getCommentUseCase.execute(useCasePayload);

        // Assert
        expect(addedComment).toStrictEqual(new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        }));
        expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
            threadId: useCasePayload.threadId,
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        }));
    });
});

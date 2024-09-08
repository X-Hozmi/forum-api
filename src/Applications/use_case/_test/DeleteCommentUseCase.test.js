const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../../Domains/repositories/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/repositories/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
    it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockThreadRepository.verifyAvailableThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyAvailableCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentByOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        await deleteCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyAvailableThreadById)
            .toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyAvailableCommentById)
            .toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.verifyCommentByOwner)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockCommentRepository.deleteComment)
            .toBeCalledWith(useCasePayload.commentId);
    });

    it('should throw NotFoundError when comment not found', async () => {
        // Arrange
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.verifyAvailableThreadById = jest.fn(() => Promise.resolve());
        mockCommentRepository.verifyAvailableCommentById = jest.fn(() => {
            throw new NotFoundError('komentar tidak ditemukan');
        });

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action & Assert
        await expect(deleteCommentUseCase.execute({
            threadId: 'thread-123',
            commentId: 'comment-170',
            owner: 'user-123',
        })).rejects.toThrowError(NotFoundError);
    });
});

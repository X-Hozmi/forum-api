const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../../Domains/repositories/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/repositories/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/repositories/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
    /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
    it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
            owner: 'user-123',
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockThreadRepository.verifyAvailableThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyAvailableCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.verifyAvailableReplyById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.verifyReplyByOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const deleteReplyUseCase = new DeleteReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        await deleteReplyUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyAvailableThreadById)
            .toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyAvailableCommentById)
            .toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.verifyAvailableReplyById)
            .toBeCalledWith(useCasePayload.replyId);
        expect(mockReplyRepository.verifyReplyByOwner)
            .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
        expect(mockReplyRepository.deleteReply)
            .toBeCalledWith(useCasePayload.replyId);
    });

    it('should throw NotFoundError when comment not found', async () => {
        // Arrange
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.verifyAvailableThreadById = jest.fn(() => Promise.resolve());
        mockCommentRepository.verifyAvailableCommentById = jest.fn(() => Promise.resolve());
        mockReplyRepository.verifyAvailableReplyById = jest.fn(() => {
            throw new NotFoundError('balasan tidak ditemukan');
        });

        const deleteReplyUseCase = new DeleteReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action & Assert
        await expect(deleteReplyUseCase.execute({
            threadId: 'thread-170',
            commentId: 'comment-170',
            replyId: 'reply-170',
            owner: 'user-170',
        })).rejects.toThrowError(NotFoundError);
    });
});

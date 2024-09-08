const AddReply = require('../../../Domains/repositories/replies/entities/AddReply');
const AddedReply = require('../../../Domains/repositories/replies/entities/AddedReply');
const ThreadRepository = require('../../../Domains/repositories/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/repositories/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/repositories/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddedReplyUseCase', () => {
    /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
    it('should orchestrating the add reply action correctly', async () => {
    // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
            content: 'Example Reply',
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockThreadRepository.verifyAvailableThreadById = jest.fn(() => Promise.resolve());
        mockCommentRepository.verifyAvailableCommentById = jest.fn(() => Promise.resolve());
        mockReplyRepository.addReply = jest.fn()
            .mockImplementation((addReply) => Promise.resolve(new AddedReply({
                id: 'reply-123',
                owner: addReply.owner,
                content: addReply.content,
            })));

        /** creating use case instance */
        const getReplyUseCase = new AddReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const addedReply = await getReplyUseCase.execute(useCasePayload);

        // Assert
        expect(addedReply).toStrictEqual(new AddedReply({
            id: 'reply-123',
            owner: useCasePayload.owner,
            content: useCasePayload.content,
        }));
        expect(mockThreadRepository.verifyAvailableThreadById)
            .toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyAvailableCommentById)
            .toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
            commentId: useCasePayload.commentId,
            owner: useCasePayload.owner,
            content: useCasePayload.content,
        }));
    });
});

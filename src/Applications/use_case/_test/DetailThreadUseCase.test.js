const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../../Domains/repositories/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/repositories/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/repositories/replies/ReplyRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    it('should orchestrate the detail thread action correctly', async () => {
        // Arrange
        const threadId = 'thread-123';
        const mockThread = {
            id: threadId,
            username: 'dicoding',
            title: 'Title',
            body: 'Body',
            date: '2024-08-31 00:00:00',
        };

        const mockComments = [
            {
                id: 'comment-123',
                username: 'dicoding',
                content: 'Comment 1',
                date: '2024-09-01 00:00:00',
                isDelete: true,
            },
            {
                id: 'comment-456',
                username: 'user456',
                content: 'Comment 2',
                date: '2024-09-01 00:00:00',
                isDelete: false,
            },
        ];

        const mockReplies = [
            {
                id: 'reply-123',
                commentId: 'comment-789',
                username: 'dicoding',
                content: 'Reply 1',
                date: '2024-09-01 01:00:00',
                isDelete: true,
            },
            {
                id: 'reply-456',
                commentId: 'comment-456',
                username: 'user456',
                content: 'Reply 2',
                date: '2024-09-01 01:00:00',
                isDelete: false,
            },
            {
                id: 'reply-789',
                commentId: 'comment-123',
                username: 'user789',
                content: 'Reply 3',
                date: '2024-09-01 01:00:00',
                isDelete: true,
            },
        ];

        const expectedDetailThread = {
            id: threadId,
            username: mockThread.username,
            title: mockThread.title,
            body: mockThread.body,
            date: mockThread.date,
            comments: [
                {
                    id: mockComments[0].id,
                    username: mockComments[0].username,
                    content: '**komentar telah dihapus**',
                    date: mockComments[0].date,
                    replies: [
                        {
                            id: mockReplies[2].id,
                            username: mockReplies[2].username,
                            content: '**balasan telah dihapus**',
                            date: mockReplies[2].date,
                        },
                    ],
                },
                {
                    id: mockComments[1].id,
                    username: mockComments[1].username,
                    content: mockComments[1].content,
                    date: mockComments[1].date,
                    replies: [
                        {
                            id: mockReplies[1].id,
                            username: mockReplies[1].username,
                            content: mockReplies[1].content,
                            date: mockReplies[1].date,
                        },
                    ],
                },
            ],
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockThreadRepository.verifyAvailableThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThread));
        mockCommentRepository.getCommentsInAThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockComments));
        mockReplyRepository.getRepliesInAThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockReplies));

        /** creating use case instance */
        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const detailedThread = await detailThreadUseCase.execute(threadId);

        // Assert
        expect(detailedThread).toStrictEqual(expectedDetailThread);
        expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(threadId);
        expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
        expect(mockCommentRepository.getCommentsInAThread).toBeCalledWith(threadId);
        expect(mockReplyRepository.getRepliesInAThread).toBeCalledWith(threadId);
    });

    it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        const threadId = 'thread-170';
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        // Mocking
        mockThreadRepository.verifyAvailableThreadById = jest.fn()
            .mockImplementation(() => Promise.reject(new NotFoundError('thread tidak ditemukan')));

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action & Assert
        await expect(detailThreadUseCase.execute(threadId)).rejects.toThrow(NotFoundError);
        expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(threadId);
    });
});

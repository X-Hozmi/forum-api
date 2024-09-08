const Comment = require('../Comment');

describe('Comment Entities', () => {
    it('should throw error when required properties are missing', () => {
        expect(() => new Comment()).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new Comment('comment-123')).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when properties do not meet data type specification', () => {
        expect(() => new Comment(123, 'thread-123', 'user-123', 'content', 'false'))
            .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Comment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            threadId: 'thread-123',
            userId: 'user-123',
            content: 'Comment',
            isDelete: false,
        };

        // Action
        const comment = new Comment(payload.id, payload.threadId, payload.userId, payload.content, payload.isDelete);

        // Assert
        expect(comment.id).toEqual(payload.id);
        expect(comment.threadId).toEqual(payload.threadId);
        expect(comment.userId).toEqual(payload.userId);
        expect(comment.content).toEqual(payload.content);
        expect(comment.isDelete).toEqual(payload.isDelete);
    });
});

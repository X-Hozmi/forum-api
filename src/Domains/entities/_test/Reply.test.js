const Reply = require('../Reply');

describe('Reply Entities', () => {
    it('should throw error when required properties are missing', () => {
        expect(() => new Reply()).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new Reply('reply-123')).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when properties do not meet data type specification', () => {
        expect(() => new Reply(123, 'comment-123', 'reply-123', ['content'], 'false'))
            .toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Reply object correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            commentId: 'comment-123',
            userId: 'user-123',
            content: 'Reply',
            isDelete: false,
        };

        // Action
        const reply = new Reply(payload.id, payload.commentId, payload.userId, payload.content, payload.isDelete);

        // Assert
        expect(reply.id).toEqual(payload.id);
        expect(reply.commentId).toEqual(payload.commentId);
        expect(reply.userId).toEqual(payload.userId);
        expect(reply.content).toEqual(payload.content);
        expect(reply.isDelete).toEqual(payload.isDelete);
    });
});

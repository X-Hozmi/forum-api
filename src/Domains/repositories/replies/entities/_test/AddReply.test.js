const AddReply = require('../AddReply');

describe('an AddReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        const payload = {
            owner: 'abc',
            content: 'abc',
        };

        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            commentId: true,
            owner: 123,
            content: 'abc',
        };

        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addReply object correctly', () => {
    // Arrange
        const payload = {
            commentId: 'thread-123',
            owner: 'user-123',
            content: 'abc',
        };

        // Action
        const { commentId, owner, content } = new AddReply(payload);

        // Assert
        expect(commentId).toEqual(payload.commentId);
        expect(owner).toEqual(payload.owner);
        expect(content).toEqual(payload.content);
    });
});

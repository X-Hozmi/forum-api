const AddComment = require('../AddComment');

describe('an AddComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        const payload = {
            owner: 'abc',
            content: 'abc',
        };

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            threadId: true,
            owner: 123,
            content: 'abc',
        };

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addComment object correctly', () => {
    // Arrange
        const payload = {
            threadId: 'thread-123',
            owner: 'user-123',
            content: 'abc',
        };

        // Action
        const { owner, threadId, content } = new AddComment(payload);

        // Assert
        expect(owner).toEqual(payload.owner);
        expect(threadId).toEqual(payload.threadId);
        expect(content).toEqual(payload.content);
    });
});

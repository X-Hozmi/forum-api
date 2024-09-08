const Thread = require('../Thread');

describe('Thread Entities', () => {
    it('should throw error when required properties are missing', () => {
        expect(() => new Thread()).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new Thread('thread-123')).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when properties do not meet data type specification', () => {
        expect(() => new Thread(123, 'user-123', 'content', true))
            .toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Thread object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            userId: 'user-123',
            title: 'title',
            body: 'body',
        };

        // Action
        const thread = new Thread(payload.id, payload.userId, payload.title, payload.body);

        // Assert
        expect(thread.id).toEqual(payload.id);
        expect(thread.userId).toEqual(payload.userId);
        expect(thread.title).toEqual(payload.title);
        expect(thread.body).toEqual(payload.body);
    });
});

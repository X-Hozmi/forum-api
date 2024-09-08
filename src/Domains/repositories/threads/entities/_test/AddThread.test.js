const AddThread = require('../AddThread');

describe('an AddThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        const payload = {
            owner: 'abc',
            body: 'abc',
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            owner: 123,
            title: true,
            body: 'abc',
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when title contains more than 100 character', () => {
    // Arrange
        const payload = {
            owner: 'Dicoding Indonesia',
            title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicodingdicodingindonesiadicodingindonesiadicodingindonesiadicoding',
            body: 'abc',
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR');
    });

    it('should create addThread object correctly', () => {
    // Arrange
        const payload = {
            owner: 'dicoding',
            title: 'Dicoding Indonesia',
            body: 'abc',
        };

        // Action
        const { owner, title, body } = new AddThread(payload);

        // Assert
        expect(owner).toEqual(payload.owner);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
    });
});

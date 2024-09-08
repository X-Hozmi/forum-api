const User = require('../User');

describe('User Entities', () => {
    it('should throw error when required properties are missing', () => {
        expect(() => new User()).toThrowError('USER.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new User('user-123')).toThrowError('USER.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when properties do not meet data type specification', () => {
        expect(() => new User(123, 'dicoding', {}, true))
            .toThrowError('USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create User object correctly', () => {
        // Arrange
        const payload = {
            id: 'user-123',
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        };

        // Action
        const user = new User(payload.id, payload.username, payload.password, payload.fullname);

        // Assert
        expect(user.id).toEqual(payload.id);
        expect(user.username).toEqual(payload.username);
        expect(user.password).toEqual(payload.password);
        expect(user.fullname).toEqual(payload.fullname);
    });
});

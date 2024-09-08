const Authentication = require('../Authentication');

describe('Authentication Entities', () => {
    it('should throw error when required properties are missing', () => {
        expect(() => new Authentication()).toThrowError('AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when properties do not meet data type specification', () => {
        expect(() => new Authentication(123))
            .toThrowError('AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Authentication object correctly', () => {
        // Arrange
        const payload = { token: 'token-123' };

        // Action
        const authentication = new Authentication(payload.token);

        // Assert
        expect(authentication.token).toEqual(payload.token);
    });
});

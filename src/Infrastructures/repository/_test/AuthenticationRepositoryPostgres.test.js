const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');
const { AuthenticationModel } = require('../../orm/index');

describe('AuthenticationRepository postgres', () => {
    afterEach(async () => {
        await AuthenticationsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        // await pool.end();
        await AuthenticationModel.sequelize.close();
    });

    describe('addToken function', () => {
        it('should add token to database', async () => {
            // Arrange
            const authenticationRepository = new AuthenticationRepositoryPostgres(AuthenticationModel);
            const token = 'token';

            // Action
            await authenticationRepository.addToken(token);

            // Assert
            const tokens = await AuthenticationsTableTestHelper.findToken(token);
            expect(tokens).toHaveLength(1);
            expect(tokens[0].token).toBe(token);
        });
    });

    describe('checkAvailabilityToken function', () => {
        it('should throw InvariantError if token not available', async () => {
            // Arrange
            const authenticationRepository = new AuthenticationRepositoryPostgres(AuthenticationModel);
            const token = 'token';

            // Action & Assert
            await expect(authenticationRepository.checkAvailabilityToken(token))
                .rejects.toThrow(InvariantError);
        });

        it('shouldn\'t throw InvariantError if token available', async () => {
            // Arrange
            const authenticationRepository = new AuthenticationRepositoryPostgres(AuthenticationModel);
            const token = 'token';
            await AuthenticationsTableTestHelper.addToken(token);

            // Action & Assert
            await expect(authenticationRepository.checkAvailabilityToken(token))
                .resolves.not.toThrow(InvariantError);
        });
    });

    describe('deleteToken', () => {
        it('should delete token from database', async () => {
            // Arrange
            const authenticationRepository = new AuthenticationRepositoryPostgres(AuthenticationModel);
            const token = 'token';
            await AuthenticationsTableTestHelper.addToken(token);

            // Action
            await authenticationRepository.deleteToken(token);

            // Assert
            const tokens = await AuthenticationsTableTestHelper.findToken(token);
            expect(tokens).toHaveLength(0);
        });
    });
});

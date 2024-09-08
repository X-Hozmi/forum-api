const InvariantError = require('../../../Commons/exceptions/InvariantError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const { UserModel } = require('../../orm/index');
const RegisterUser = require('../../../Domains/repositories/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/repositories/users/entities/RegisteredUser');

describe('UserRepositoryPostgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UserModel.sequelize.close();
    });

    describe('verifyAvailableUsername function', () => {
        it('should throw InvariantError when username not available', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ username: 'dicoding' }); // memasukan user baru dengan username dicoding
            const userRepositoryPostgres = new UserRepositoryPostgres(UserModel, {});

            // Action & Assert
            await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrowError(InvariantError);
        });

        it('shouldn\'t throw InvariantError when username available', async () => {
            // Arrange
            const userRepositoryPostgres = new UserRepositoryPostgres(UserModel, {});

            // Action & Assert
            await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(InvariantError);
        });
    });

    describe('addUser function', () => {
        it('should persist register user and return registered user correctly', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'secret_password',
                fullname: 'Dicoding Indonesia',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const userRepositoryPostgres = new UserRepositoryPostgres(UserModel, fakeIdGenerator);

            // Action
            await userRepositoryPostgres.addUser(registerUser);

            // Assert
            const users = await UsersTableTestHelper.findUsersById('user-123');
            expect(users).toHaveLength(1);
        });

        it('should return registered user correctly', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'secret_password',
                fullname: 'Dicoding Indonesia',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const userRepositoryPostgres = new UserRepositoryPostgres(UserModel, fakeIdGenerator);

            // Action
            const registeredUser = await userRepositoryPostgres.addUser(registerUser);

            // Assert
            expect(registeredUser).toStrictEqual(new RegisteredUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
            }));
        });
    });

    describe('getPasswordByUsername', () => {
        it('should throw InvariantError when user not found', () => {
            // Arrange
            const userRepositoryPostgres = new UserRepositoryPostgres(UserModel, {});

            // Action & Assert
            return expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
                .rejects
                .toThrowError(InvariantError);
        });

        it('should return username password when user is found', async () => {
            // Arrange
            const userRepositoryPostgres = new UserRepositoryPostgres(UserModel, {});
            await UsersTableTestHelper.addUser({
                username: 'dicoding',
                password: 'secret_password',
            });

            // Action & Assert
            const password = await userRepositoryPostgres.getPasswordByUsername('dicoding');
            expect(password).toBe('secret_password');
        });
    });

    describe('getIdByUsername', () => {
        it('should throw InvariantError when user not found', async () => {
            // Arrange
            const userRepositoryPostgres = new UserRepositoryPostgres(UserModel, {});

            // Action & Assert
            await expect(userRepositoryPostgres.getIdByUsername('dicoding'))
                .rejects
                .toThrowError(InvariantError);
        });

        it('should return user id correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dicoding' });
            const userRepositoryPostgres = new UserRepositoryPostgres(UserModel, {});

            // Action
            const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

            // Assert
            expect(userId).toEqual('user-321');
        });
    });
});

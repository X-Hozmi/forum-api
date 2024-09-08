const InvariantError = require('../../Commons/exceptions/InvariantError');
const UserRepository = require('../../Domains/repositories/users/UserRepository');
const RegisteredUser = require('../../Domains/repositories/users/entities/RegisteredUser');

class UserRepositoryPostgres extends UserRepository {
    constructor(userModel, idGenerator) {
        super();
        this._userModel = userModel;
        this._idGenerator = idGenerator;
    }

    async verifyAvailableUsername(username) {
        const userRecord = await this._userModel.findOne({
            where: { username },
        });

        if (userRecord) throw new InvariantError('username tidak tersedia');
    }

    async addUser(registerUser) {
        const id = `user-${this._idGenerator()}`;
        const { username, password, fullname } = registerUser;

        const userRecord = await this._userModel.create({
            id, username, password, fullname,
        });

        return new RegisteredUser({
            id: userRecord.id,
            username: userRecord.username,
            fullname: userRecord.fullname,
        });
    }

    async getPasswordByUsername(username) {
        const userRecord = await this._userModel.findOne({
            where: { username },
            attributes: ['password'],
        });

        if (!userRecord) throw new InvariantError('username tidak ditemukan');

        return userRecord.password;
    }

    async getIdByUsername(username) {
        const userRecord = await this._userModel.findOne({
            where: { username },
            attributes: ['id'],
        });

        if (!userRecord) throw new InvariantError('user tidak ditemukan');

        return userRecord.id;
    }
}

module.exports = UserRepositoryPostgres;

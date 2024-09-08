const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthenticationRepository = require('../../Domains/repositories/authentications/AuthenticationRepository');

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
    constructor(authModel) {
        super();
        this._authModel = authModel;
    }

    async addToken(token) {
        await this._authModel.create({ token });
    }

    async checkAvailabilityToken(token) {
        const authRecord = await this._authModel.findOne({
            where: { token },
        });

        if (!authRecord) throw new InvariantError('refresh token tidak ditemukan di database');
    }

    async deleteToken(token) {
        await this._authModel.destroy({
            where: { token },
        });
    }
}

module.exports = AuthenticationRepositoryPostgres;

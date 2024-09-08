/* istanbul ignore file */
const { sequelize, AuthenticationModel } = require('../src/Infrastructures/orm/index');

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    await AuthenticationModel.create({ token: token });
  },

  async findToken(token) {
    const authRecord = await AuthenticationModel.findOne({
      where: { token },
    });

    return authRecord ? [authRecord.toJSON()] : [];
  },
  
  async cleanTable() {
    await sequelize.query('DELETE FROM "Authentications" WHERE 1=1');
  },
};

module.exports = AuthenticationsTableTestHelper;

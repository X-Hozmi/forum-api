/* istanbul ignore file */
const { sequelize, UserModel } = require('../src/Infrastructures/orm/index');

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123', username = 'dicoding', password = 'secret', fullname = 'Dicoding indonesia',
  }) {
    await UserModel.create({ id, username, password, fullname });
  },

  async findUsersById(id) {
    const user = await UserModel.findOne({
      where: { id },
    });
    
    return user ? [user.toJSON()] : [];
  },

  async cleanTable() {
    await sequelize.query('DELETE FROM "Users" WHERE 1=1');
  },
};

module.exports = UsersTableTestHelper;
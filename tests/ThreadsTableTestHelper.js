/* istanbul ignore file */
const { sequelize, ThreadModel } = require('../src/Infrastructures/orm/index');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', userId = 'user-123', title = 'Title', body = 'Body',
  }) {
    await ThreadModel.create({ id, userId, title, body });
  },

  async findThreadById(id) {
    const thread = await ThreadModel.findOne({
      where: { id },
    });
    
    return thread ? [{
      id: thread.id,
      owner: thread.userId,
      title: thread.title,
      body: thread.body,
      date: thread.createdAt.toISOString(),
    }] : [];
  },

  async cleanTable() {
    await sequelize.query('DELETE FROM "Threads" WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;

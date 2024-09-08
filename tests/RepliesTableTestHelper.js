/* istanbul ignore file */
const { sequelize, ReplyModel } = require('../src/Infrastructures/orm/index');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', commentId = 'comment-123', userId = 'user-123', content = 'Reply',
  }) {
    await ReplyModel.create({ id, commentId, userId, content });
  },

  async findReplyById(id) {
    const reply = await ReplyModel.findOne({
      where: { id },
    });
    
    return reply ? [{
      id: reply.id,
      commentId: reply.commentId,
      owner: reply.userId,
      content: reply.content,
      isDelete: reply.isDelete,
      date: reply.createdAt.toISOString(),
    }] : [];
  },

  async cleanTable() {
    await sequelize.query('DELETE FROM "Replies" WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;

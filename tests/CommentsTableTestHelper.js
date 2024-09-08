/* istanbul ignore file */
const { sequelize, CommentModel } = require('../src/Infrastructures/orm/index');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', threadId = 'thread-123', userId = 'user-123', content = 'Content',
  }) {
    await CommentModel.create({ id, threadId, userId, content });
  },

  async findCommentById(id) {
    const comment = await CommentModel.findOne({
      where: { id },
    });
    
    return comment ? [{
      id: comment.id,
      threadId: comment.threadId,
      owner: comment.userId,
      content: comment.content,
      isDelete: comment.isDelete,
      date: comment.createdAt.toISOString(),
    }] : [];
  },

  async cleanTable() {
    await sequelize.query('DELETE FROM "Comments" WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;

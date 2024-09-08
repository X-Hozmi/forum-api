const { sequelize } = require('./sequelize');
const UserModel = require('./models/UserModel');
const ThreadModel = require('./models/ThreadModel');
const CommentModel = require('./models/CommentModel');
const ReplyModel = require('./models/ReplyModel');

(async () => {
    try {
        UserModel.associate({ Thread: ThreadModel, Comment: CommentModel, Reply: ReplyModel });
        ThreadModel.associate({ User: UserModel, Comment: CommentModel });
        CommentModel.associate({ Thread: ThreadModel, User: UserModel, Reply: ReplyModel });
        ReplyModel.associate({ Comment: CommentModel, User: UserModel });
        await sequelize.sync({ alter: true });
        console.log('Database & tables have been created/synced successfully');
        process.exit(0);
    } catch (error) {
        console.error('Failed to sync database:', error);
        process.exit(1);
    }
})();

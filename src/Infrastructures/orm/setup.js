const { sequelize, AuthenticationModel, UserModel, ThreadModel, CommentModel, ReplyModel } = require('./index');

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

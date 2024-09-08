const { sequelize } = require('./sequelize'); /* eslint-disable-line no-unused-vars */
const AuthenticationModel = require('./models/AuthenticationModel');
const UserModel = require('./models/UserModel');
const ThreadModel = require('./models/ThreadModel');
const CommentModel = require('./models/CommentModel');
const ReplyModel = require('./models/ReplyModel');

(async () => {
    try {
        await ReplyModel.drop();
        await CommentModel.drop();
        await ThreadModel.drop();
        await AuthenticationModel.drop();
        await UserModel.drop();
        console.log('All tables have been dropped successfully');
        process.exit(0);
    } catch (error) {
        console.error('Failed to drop tables:', error);
        process.exit(1);
    }
})();

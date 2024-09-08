const { sequelize } = require('./sequelize');
const AuthenticationModel = require('./models/AuthenticationModel');
const UserModel = require('./models/UserModel');
const ThreadModel = require('./models/ThreadModel');
const CommentModel = require('./models/CommentModel');
const ReplyModel = require('./models/ReplyModel');

const models = {
    sequelize,
    AuthenticationModel,
    UserModel,
    ThreadModel,
    CommentModel,
    ReplyModel,
};

module.exports = models;

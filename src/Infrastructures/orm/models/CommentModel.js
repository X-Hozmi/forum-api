/* istanbul ignore file */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const CommentModel = sequelize.define('Comment', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
    },
    threadId: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        set(value) {
            if (value === 'true') value = true; /* eslint-disable-line no-param-reassign */
            if (value === 'false') value = false; /* eslint-disable-line no-param-reassign */
            this.setDataValue('isDelete', value);
        },
    },
});

CommentModel.associate = (models) => {
    CommentModel.belongsTo(models.Thread, { foreignKey: 'threadId', onDelete: 'CASCADE' });
    CommentModel.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    CommentModel.hasMany(models.Reply, { foreignKey: 'commentId', onDelete: 'CASCADE' });
};

module.exports = CommentModel;

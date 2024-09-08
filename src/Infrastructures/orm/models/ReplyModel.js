/* istanbul ignore file */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const ReplyModel = sequelize.define('Reply', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
    },
    commentId: {
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

ReplyModel.associate = (models) => {
    ReplyModel.belongsTo(models.Comment, { foreignKey: 'commentId', onDelete: 'CASCADE' });
    ReplyModel.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
};

module.exports = ReplyModel;

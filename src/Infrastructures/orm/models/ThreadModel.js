/* istanbul ignore file */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const ThreadModel = sequelize.define('Thread', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

ThreadModel.associate = (models) => {
    ThreadModel.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    ThreadModel.hasMany(models.Comment, { foreignKey: 'threadId', onDelete: 'CASCADE' });
};

module.exports = ThreadModel;

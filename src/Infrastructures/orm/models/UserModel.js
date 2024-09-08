/* istanbul ignore file */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const UserModel = sequelize.define('User', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            is: /^\w{3,}$/,
        },
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fullname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

UserModel.associate = (models) => {
    UserModel.hasMany(models.Thread, { foreignKey: 'userId', onDelete: 'CASCADE' });
    UserModel.hasMany(models.Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
    UserModel.hasMany(models.Reply, { foreignKey: 'userId', onDelete: 'CASCADE' });
};

module.exports = UserModel;

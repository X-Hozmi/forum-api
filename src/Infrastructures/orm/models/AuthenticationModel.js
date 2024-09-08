/* istanbul ignore file */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const AuthenticationModel = sequelize.define('Authentication', {
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: false,
});
AuthenticationModel.removeAttribute('id');

module.exports = AuthenticationModel;

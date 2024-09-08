/* istanbul ignore file */
require('dotenv').config();
const { Sequelize } = require('sequelize');

const config = process.env.NODE_ENV === 'test' ? {
    host: process.env.PGHOST_TEST,
    port: process.env.PGPORT_TEST,
    user: process.env.PGUSER_TEST,
    password: process.env.PGPASSWORD_TEST,
    database: process.env.PGDATABASE_TEST,
} : {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
};

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: process.env.DBPROTOCOL,
});

module.exports = { sequelize };

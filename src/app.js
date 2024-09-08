require('dotenv').config();
const { sequelize } = require('./Infrastructures/orm/sequelize');
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

(async () => {
    console.log('Checking database connection...');
    try {
        await sequelize.authenticate();
        console.log('Database connection OK!');
        const server = await createServer(container);
        await server.start();
        console.log(`server start at ${server.info.uri}`);
    } catch (error) {
        console.log('Unable to connect to the database:');
        console.log(error.message);
        process.exit(1);
    }
})();

// Line for CD Test
const { Pool } = require('pg');
const dotenv = require('dotenv');
const models = require('./models');

dotenv.config();

const postgresURI = require('../config/keys').postgreURI;

const pool = new Pool({
    connectionString: postgresURI,
    // ssl: false,
     ssl: {
        rejectUnauthorized: false
    }
});

(async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await models(client);
        await client.query('COMMIT');  
    } catch (err) {
        await client.query('ROLLBACK');
        console.log(err);
    } finally {
        client.release();
    }
})();


module.exports = pool;

const db = require('../db');

module.exports = {
    findById(data) {
        const { id } = data;

        if(!id) {
            return { message: 'Please provide user ID.'};
        }

        let result = db.query(`SELECT * FROM users WHERE id = $1`, [id]);

        return result.rows[0];
    }
};
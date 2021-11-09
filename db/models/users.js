module.exports =  {
    CREATE_TABLE: `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(15) NOT NULL,
        otp VARCHAR(10),
        otp_verify INT DEFAULT 0,
        status VARCHAR(255),
        avatar VARCHAR(255),
        created_date timestamptz NOT NULL DEFAULT NOW(),
        updated_date TIMESTAMP default NULL
    )`
};
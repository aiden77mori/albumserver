module.exports =  {
    CREATE_TABLE: `
    CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        user_phone_number VARCHAR(50),
        clientname VARCHAR(50),
        client_phone_number VARCHAR(50),
        block_status INT NOT NULL DEFAULT 1,
        created_date timestamptz NOT NULL DEFAULT NOW(),
        updated_date TIMESTAMP default NULL     
    );`
};
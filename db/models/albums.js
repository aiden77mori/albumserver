module.exports =  {
    CREATE_TABLE: `CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        created_date timestamptz NOT NULL DEFAULT NOW(),
        updated_date TIMESTAMP DEFAULT NULL    
    )`
};
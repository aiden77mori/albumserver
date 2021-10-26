module.exports =  {
    CREATE_TABLE: `CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        album_id INT NOT NULL,
        sign INT DEFAULT 0,
        created_date timestamptz NOT NULL DEFAULT NOW()
    );`
};
module.exports =  {
    CREATE_TABLE: `
    CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        client_id INT NOT NULL,
        album_id INT NOT NULL,
        photo_id INT NOT NULL,
        parent_id INT NULL,
        comment TEXT,
        sign INT DEFAULT 0,
        created_date timestamptz NOT NULL DEFAULT NOW() 
    );`
};
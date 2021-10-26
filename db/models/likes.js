module.exports =  {
    CREATE_TABLE: `
    CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        photo_id INT NOT NULL,
        sign INT DEFAULT 0,
        like_status INT DEFAULT 1,
        created_date timestamptz NOT NULL DEFAULT NOW()
    );`
};
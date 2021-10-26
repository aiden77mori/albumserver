module.exports =  {
    CREATE_TABLE: `CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        album_id INT NOT NULL,
        uploadcare_url VARCHAR(100) NOT NULL,
        caption VARCHAR(50) NOT NULL,
        created_date timestamptz NOT NULL DEFAULT NOW(),
        updated_date TIMESTAMP default NULL     
    )`
};
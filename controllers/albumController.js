const db = require('../db');

module.exports = class albumController {

    static create(req, res) {
        const newAlbum = {
            user_id : req.user.id,
            name : req.body.name
        }
        const errors = {};
        db.query(`SELECT * FROM albums WHERE user_id = $1 AND name = $2`, [newAlbum.user_id, newAlbum.name])
        .then((result) => {
            if(result.rows[0]) {
                errors.name = 'Album name is exist';
                res.status(400).json(errors);
            } else {
                db.query(`INSERT INTO albums (user_id, name) VALUES ($1, $2)`, [newAlbum.user_id, newAlbum.name])
                .then(() => res.status(201).send(newAlbum))
                .catch(({ err }) => res.status(500).send({ err }));
            }
        })
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static get(req, res) {
        let user_id = req.body.user_id;
        db.query(`SELECT
                    a.* , max(p.uploadcare_url) as uploadcare_url
                FROM
                    albums as a
                LEFT JOIN photos as p on a.id = p.album_id
                WHERE	user_id = $1 
                GROUP BY a.id
                ORDER BY
                    a.id ASC`, [user_id])
        .then((result) => res.status(200).send(result.rows))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static getId(req,res) {
        let photo_id = req.body.photo_id;

        db.query(`SELECT album_id FROM photos WHERE id = $1`, [photo_id])
        .then((result) => res.status(200).send(result.rows[0]))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static edit(req, res) {
        const editAlbums = {
            user_id : req.user.id,
            album_id: req.body.album_id,
            newName : req.body.newName   
        }
        const errors = {};
        if(!editAlbums.newName) {
            errors.newName = 'Please provide a Album Name';
            return res.status(400).json(errors);
        }

        db.query(`UPDATE albums SET name = $1, updated_date = NOW() WHERE user_id = $2 AND id = $3`, [editAlbums.newName, editAlbums.user_id, editAlbums.album_id])
        .then(() => res.send(editAlbums))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static getUserInfoByAlbumId(req, res) {
        const album_id = req.body.album_id;

        db.query(`select u.id as user_id, u.first_name, u.last_name, a.name as album_name
        from users as u
        left join albums as a on a.user_id = u.id
        where a.id = $1`, [album_id])
        .then((result) => res.send(result.rows[0]))
        .catch(({ err }) => res.status(200).send({ err }));
    }
    
}
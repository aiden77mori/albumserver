const db = require('../db');

module.exports = class contactController {

    static create(req, res) {
        const newComment = {
            user_id: req.user.id,
            client_id: req.body.client_id,
            album_id: req.body.album_id,
            photo_id: req.body.photo_id,
            parent_id: req.body.parent_id,
            comment: req.body.comment
        }
        console.log(newComment);

        db.query(`
            INSERT INTO comments (user_id, client_id, album_id, photo_id, parent_id, comment) VALUES ($1, $2, $3, $4, $5, $6)
        `, [newComment.user_id, newComment.client_id, newComment.album_id, newComment.photo_id, newComment.parent_id, newComment.comment])
        .then(() => res.status(201).send(newComment))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static get(req, res) {
        const album_id = req.body.album_id;
        const photo_id = req.body.photo_id;

        db.query(`SELECT c.*, now() - c.created_date as past_time, u.first_name, u.last_name, u.avatar FROM comments as c LEFT JOIN users as u on u.id = c.user_id WHERE album_id = $1 AND photo_id = $2 ORDER BY c.parent_id ASC`, [album_id, photo_id])
        .then((result) => {
            res.status(200).send(result.rows);
            if(result.rows.length > 0) {
                let comment_array = result.rows;
                comment_array.map((ca) => {
                    db.query(`UPDATE comments SET sign = 1 WHERE id = $1`, [ca.id]);
                });
            }
        })
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static getRecent(req, res) {
        const album_id = req.body.album_id;
        const photo_id = req.body.photo_id;

        db.query(`SELECT c.*, now() - c.created_date as past_time, u.first_name, u.last_name, u.avatar FROM comments as c LEFT JOIN users as u on u.id = c.user_id WHERE album_id = $1 AND photo_id = $2 ORDER BY c.parent_id ASC`, [album_id, photo_id])
        .then((result) => {
            res.status(200).send(result.rows);
        })
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static getCount(req, res) {
        const user_id = req.body.user_id;

        db.query(`SELECT COUNT(id) FROM comments WHERE client_id = $1 and sign = 0`, [user_id])
        .then((result) => res.status(200).send(result.rows[0]))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static getNewCommentPhoto(req, res) {
        const user_id = req.body.user_id;

        db.query(`SELECT c.comment_count, c.photo_id, p.uploadcare_url, p.album_id, p.caption
        FROM 
                (select count(photo_id) as comment_count, photo_id from comments where sign = 0 and client_id = $1 GROUP BY photo_id) as c
        LEFT JOIN photos as p on p.id = c.photo_id
        `, [user_id])
        .then((result) => res.status(200).send(result.rows))
        .catch(({ err }) => res.status(500).send({ err }));
    }
}
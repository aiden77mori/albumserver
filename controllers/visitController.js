const db = require('../db');

module.exports = class visitController {

    static create(req, res) {

        const newVisit = {
            user_id: req.user.id,
            album_id: req.body.album_id
        }

        db.query(`SELECT album_id FROM visits WHERE user_id = $1 AND album_id = $2`, [newVisit.user_id, newVisit.album_id])
        .then((result) => {
            if(result.rows[0]) {
                db.query(`UPDATE visits SET created_date = NOW() WHERE album_id = $1 and user_id = $2`, [newVisit.album_id, newVisit.user_id])
                .then(() => res.status(200).send(newVisit))
                .catch(({ err }) => res.status(500).send({ err }));
            } else {
                db.query(`INSERT INTO visits (user_id, album_id, created_date) VALUES ($1, $2, now())`, [newVisit.user_id, newVisit.album_id])
                .then(() => res.status(201).send(newVisit))
                .catch(({ err }) => res.status(500).send({ err }));
            }
        })
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static get(req, res) {
        const album_id = req.body.album_id;

        db.query(`
        SELECT
            v.id,
            v.created_date,
            v.album_id,
            v.user_id as client_id,
            u.first_name,
            u.last_name,
            u.avatar,
            now() - v.created_date as past_time
        FROM
            visits as v
            LEFT JOIN albums AS a ON a.id = v.album_id
            LEFT JOIN users AS u ON u.id = v.user_id
        WHERE v.album_id = $1 AND v.sign = 0
        ORDER BY past_time ASC
        `, [album_id])
        .then((result) => { 
            res.status(200).send(result.rows);
            // let visit_array = result.rows;
            // if(visit_array.length > 0) {
            //     visit_array.map((va) => {
            //         db.query(`UPDATE visits SET sign = 1 WHERE id = $1`, [va.id]);
            //     });
            // }
        })
        .catch(({ err }) => res.status(500).send({ err }));
    }
}
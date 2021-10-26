const db = require('../db');

module.exports = class likeController {

    static give(req, res) {
        const newLike = {
            user_id : req.user.id,
            photo_id : req.body.photo_id       
        }

        db.query(`SELECT * FROM likes WHERE user_id = $1 AND photo_id = $2`, [newLike.user_id, newLike.photo_id])
        .then((result) => {
            if(result.rows[0]) {
                const updateLike = {
                    like_status : (result.rows[0]['like_status'] == 0 ? 1 : 0),
                    id : result.rows[0]['id']
                }
                db.query(`UPDATE likes SET like_status = $1 WHERE id = $2`, [updateLike.like_status, updateLike.id])
                .then(() => res.status(200).send(updateLike))
                .catch(({ err }) => res.status(500).send({ err }));
            } else {
                db.query(`INSERT INTO likes (user_id, photo_id, created_date) VALUES ($1, $2, now())`, [newLike.user_id, newLike.photo_id])
                .then(() => res.status(201).send(newLike))
                .catch(({ err }) => res.status(500).send({ err }));
            }
        })
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static get(req, res) {
        let user_id = req.body.user_id;
        let by = req.body.by;
        
        // For Experiment values
        // let by = {photo_id: 4};
        // let by = {album_id: 3};
        // if(!user_id) {
        //     user_id = req.user.id;
        // }
        if(by) {
            const key = Object.keys(by)[0];
            const value = by[key];

            db.query(`
            SELECT COUNT(L.photo_id) as like_count
            FROM likes AS L  
                LEFT JOIN photos AS P ON L.photo_id = P.id
                LEFT JOIN albums AS A ON A.id = P.album_id
            WHERE A.user_id = $1 AND ${key} = $2 AND L.like_status = 1`, [user_id, value])
            .then((result) => res.status(200).send(result.rows[0]))
            .catch(({ err }) => res.status(500).send({ err }));
        
        } else {

            db.query(`
            SELECT COUNT(L.photo_id) as total_likes 
            FROM likes AS L  
                LEFT JOIN photos AS P ON L.photo_id = P.id
                LEFT JOIN albums AS A ON A.id = P.album_id
            WHERE A.user_id = $1 AND L.like_status = 1`, [user_id])
            .then((result) => res.status(200).send(result.rows[0]))
            .catch(({ err }) => res.status(500).send({ err }));

        }
    }

    static getLists(req, res) {
        const user_id = req.body.user_id;

        db.query(`
        SELECT 
            L.photo_id,
            P.uploadcare_url,
            L.user_id as client_id,
            U.first_name,
            U.last_name,
            U.avatar,
            now() - L.created_date AS past_time
        FROM likes AS L  
            LEFT JOIN photos AS P ON L.photo_id = P.id
            LEFT JOIN albums AS A ON A.id = P.album_id
            LEFT JOIN users AS U ON U.id = L.user_id
        WHERE A.user_id = $1 AND L.sign = 0 AND L.like_status = 1
        ORDER BY past_time ASC`, [user_id])
        .then((result) => {
            res.status(200).send(result.rows);
            let photo_array = result.rows;
            if(photo_array.length > 0) {
                photo_array.map((pa) => {
                    db.query(`UPDATE likes SET sign = 1 WHERE photo_id = $1`, [pa.photo_id]);
                });
            }
        } )
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static getLikesCount(req, res) {
        const user_id = req.body.user_id;

        db.query(`
        SELECT 
            COUNT(L.photo_id)   
        FROM likes AS L  
            LEFT JOIN photos AS P ON L.photo_id = P.id
            LEFT JOIN albums AS A ON A.id = P.album_id
            LEFT JOIN users AS U ON U.id = L.user_id
        WHERE A.user_id = $1 AND L.sign = 0 AND L.like_status = 1`, [user_id])
        .then((result) => res.status(200).send(result.rows[0]))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static getLikeStatus(req, res) {
        const photo_id = req.body.photo_id;
        const user_id = req.body.user_id;

        db.query(`select * from likes where user_id = $1 and photo_id = $2`, [user_id, photo_id])
        .then((result) => {
            res.status(200).send(result.rows[0]);
        })
        .catch(({ err }) => res.status(500).send({ err }));
    }
}
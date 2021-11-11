const db = require('../db');

module.exports = class photoController {

    static save(req, res) {
        const newPhoto = {
            album_id : req.body.album_id,
            uploadcare_url : req.body.uploadcare_url,
            caption: req.body.caption      
        }
        
        db.query(`INSERT INTO photos (album_id, uploadcare_url, caption) VALUES ($1, $2, $3)`, [newPhoto.album_id, newPhoto.uploadcare_url, newPhoto.caption])
        .then(() => res.status(201).send(newPhoto))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static get(req, res) {
        const photo_id = req.body.photo_id;

        db.query(`SELECT * FROM photos  WHERE id = $1`, [photo_id])
        .then((result) => res.status(200).send(result.rows[0]))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static getRecent(req,res) {
        db.query(`Select p.id as photo_id, a.id as album_id, u.id as user_id, u.first_name, u.last_name, u.avatar
                    From photos p
                    Join albums as a On p.album_id= a.id
                    join users as u on u.id = a.user_id
                    ORDER BY p.id desc
        `).then((result) => {
            if(result.rows.length > 0) {
                let sendList = [];
                let sign = 0;
                sendList.push(result.rows[0]);
                result.rows.map((res, i) => {
                    sign = 0;
                    for (let i = 0; i < sendList.length; i ++) {
                        if(sendList[i]['user_id'] == res['user_id']) {
                            sign = 1;
                            break;
                        }
                    }
                    if(sign == 0) {
                        sendList.push(res);
                    }
                });
                res.status(200).send(sendList);
            }
        }).catch(({ err }) => res.status(500).send({ err }));
    }

    static getAllByAlbum(req, res) {
        const album_id = req.body.album_id;
        
        db.query(`SELECT * FROM photos WHERE album_id = $1 ORDER BY id`, [album_id])
        .then((result) => res.status(200).send(result.rows))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static getUserInfoByPhotoId(req, res) {
        const photo_id = req.body.photo_id;

        db.query(`SELECT
                    a.user_id
                FROM
                    photos as p
                LEFT JOIN albums as a on a.id = p.album_id
                WHERE
                    p.id = $1`, [photo_id])
        .then((result) => {
            if(result.rows[0]) {
                res.status(200).send(result.rows[0]);
            }
        })
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static edit(req, res) {
        const editPhotos = {
            photo_id: req.body.photo_id,
            newCaption : req.body.newCaption   
        }
        const errors = {};
        if(!editPhotos.newCaption) {
            errors.newCaption = 'Please provide a Photo Caption';
            return res.status(400).json(errors);
        }

        db.query(`UPDATE photos SET caption = $1, updated_date = NOW() WHERE id = $2`, [editPhotos.newCaption, editPhotos.photo_id])
        .then(() => res.status(200).send(editPhotos))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static delete(req, res) {
        const photo_id = req.params.photo_id;
        
        db.query(`DELETE FROM photos WHERE id = $1`, [photo_id])
        .then(() => res.status(203).send(photo_id))
        .catch(({ err }) => res.status(500).send({ err }));
    }
    
}
const db = require('../db');

module.exports = class contactController {

    static get(req, res) {
        const searchValue = req.body['contact'].searchValue;
        const contactStatus = req.body['contact'].contactStatus;
        const phone_number = req.body['contact'].phone_number;
      
        // IF contactStatus == 1, I contact other.
        // ELSE IF contactStatus == 0, Others contact me.
        if(contactStatus == 1) {
            
            db.query(`SELECT C
                        .ID AS cid,
                        u.id as client_id,
                        C.block_status,
                        u.first_name,
                        u.last_name,
                        C.clientname,
                        C.client_phone_number,
                        u.status,
                        u.avatar 
                    FROM
                        contacts
                        AS C LEFT JOIN users AS u ON u.phone_number = C.client_phone_number 
                    WHERE c.user_phone_number = $1 ORDER BY C.clientname ASC`, [phone_number])
            .then(result => res.send(result.rows))
            .catch(({ err }) => res.status(500).send(err));

        } else {
           
            db.query(`SELECT C
                            .ID AS cid,
                            u.id as user_id,
                            C.block_status,
                            u.first_name,
                            u.last_name,
                            u.phone_number,
                            u.status,
                            u.avatar 
                        FROM
                            contacts
                            AS C LEFT JOIN users AS u ON u.phone_number = C.user_phone_number
                        WHERE
                            C.client_phone_number = $1`, [phone_number])
            .then(result => res.send(result.rows))
            .catch(({ err }) => res.status(500).send(err));

        }
    }

    static getRecent(req, res) {
        const phone_number = req.body.phone_number;

         db.query(`SELECT C
                    .ID AS cid,
                    u.id,
                    u.first_name,
                    u.last_name,
                    u.phone_number,
                    u.status,
                    u.avatar 
                FROM
                    contacts
                    AS C LEFT JOIN users AS u ON u.phone_number = C.user_phone_number
                WHERE
                    C.client_phone_number = $1 
                ORDER BY
                    C.created_date DESC 
                    LIMIT 5`, [phone_number])
                .then(result => res.send(result.rows))
                .catch(({ err }) => res.status(500).send(err));
    }

    static create(req, res) {

        const user_phone_number = req.body.phone_number;
        const contact_list = req.body.contact_list;
        let list = '';
        for(let i = 0; i < contact_list.length; i ++) {
            list += "(" + user_phone_number + "," + contact_list[i]['phone_number'] + "," + "'" +contact_list[i]['user_name'] + "'" + "),";
        }
        list = list.slice(0,-1);

        console.log(`INSERT INTO contacts (user_phone_number, client_phone_number, clientname) VALUES ${list}`);
        db.query(`INSERT INTO contacts (user_phone_number, client_phone_number, clientname) VALUES ${list}`)
        .then(() => res.status(201).send({message:'success'}))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static block(req, res) {
        const contactInfo = {
            // user_id : req.user.id,
            user_phone_number: req.body.user_phone_number,
            client_phone_number : req.body.client_phone_number,
            block_status : req.body.block_status,
            // who: req.body.who
        }
        // block_status == 1 : Unblock 
        // blcok_status == 0 : Block
        db.query(`SELECT * FROM contacts WHERE user_phone_number = $1 AND client_phone_number = $2`, [contactInfo.user_phone_number, contactInfo.client_phone_number]).then((result) => {
            if(result.rows[0]) {
                db.query(`UPDATE contacts SET block_status = $1 WHERE user_phone_number = $2 AND client_phone_number = $3`, [contactInfo.block_status, contactInfo.user_phone_number, contactInfo.client_phone_number])
                .then(() => res.status(200).send({contactInfo: contactInfo, status: 'success'}))
                .catch(({ err }) => res.status(500).send({ err }));
            } else {
                res.send({message: 'You must contact this user first in your Contact', status: 'warn'});
            }
        })
    }

    static blockStatus(req, res) {
        const user_id = req.body.user_id;
        const client_id = req.body.client_id;

        db.query(`SELECT block_status FROM contacts WHERE user_id = $1 and client_id = $2`, [user_id, client_id])
        .then((result) => { res.status(200).send(result.rows[0])})
        .catch(({ err }) => res.status(500).send({ err }));
    }
}
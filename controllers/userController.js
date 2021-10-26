const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const { generateOTP, fast2sms } = require('../config/otputils');
// var otpGenerator = require('otp-generator');

const db = require('../db');

// Load Validation
const validationRegister = require('../validation/register');
const validationLogin = require('../validation/login');

module.exports = class userController {

    static register(req, res) {
        const newUser = {
            first_name: req.body.user.first_name,
            last_name: req.body.user.last_name,
            phone_number: req.body.user.phone_number,
        }
        const tc = req.body.user.tc;
        const { errors, isValid } = validationRegister(newUser);
        // Check Validation
        if(!isValid) {
            return res.status(400).json(errors);
        }
        if(!tc) {
            errors.tc = 'Please check the terms and policy';
            res.status(400).json(errors);
            return;
        }
        const otp = generateOTP(4);
        console.log(otp);

        const phone_number = newUser.phone_number;

        db.query(`SELECT * FROM users WHERE phone_number = $1`, [phone_number])
        .then(result => { 
            if(result.rows[0]) {
                errors.phone_number = 'Phone number is exist';
                res.status(400).json(errors);
            } else {
                db.query(`INSERT INTO users (first_name, last_name, phone_number) VALUES ($1, $2, $3)`, [newUser.first_name, newUser.last_name, newUser.phone_number])
                .then(() => res.status(201).send({newUser: newUser, tc: tc}))
                .catch(({ err }) => res.status(500).send({ err }));
            }
        })
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static async login(req, res) {
        const phone_number = req.body.phone_number;
        const { errors, isValid } = await validationLogin(phone_number);
        // Check Validation
        if(!isValid) {
            return res.status(400).json(errors);
        }
        
        await db.query(`SELECT * FROM users WHERE phone_number = $1`, [phone_number])
        .then(user => { 
            if(!user.rows[0]) {
                errors.login_error = 'There are no match with this phone number';
                return res.status(404).json(errors);
            }
            const userInfo = user.rows[0];
            const payload = { id: userInfo['id'], phone_number: userInfo['phone_number'] };
            // Sign Token
            const expiresIn = 7200;
            const token = jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: expiresIn },
            );

            let userTokenInfo = {    
                id: userInfo.id,
                phone_number: userInfo.phone_number,
                first_name: userInfo.first_name,
                last_name: userInfo.last_name,
                status: userInfo.status,
                avatar: userInfo.avatar,
                token: 'Bearer ' + token,
                expiresIn : expiresIn
            }

            res.status(200).json(userTokenInfo);
         }) 

    }

    static updateProfile(req, res) {
        const { errors, isValid } = validationRegister(req.body);
        // Check Validation
        if(!isValid) {
            return res.status(400).json(errors);
        }
        const updateInfo = {
            user_id: req.user.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number
        }

        db.query(`UPDATE users SET first_name = $1, last_name = $2, phone_number = $3, updated_date = NOW() WHERE id = $4`, [updateInfo.first_name, updateInfo.last_name, updateInfo.phone_number, updateInfo.user_id])
        .then(() => res.status(200).send({updateInfo: updateInfo, status: 'success'}))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static updateAvatar(req, res) {
        const user_id = req.user.id;
        const avatar_url = req.body.avatar_url;

        db.query(`UPDATE users SET avatar = $1, updated_date = NOW() WHERE id = $2`, [avatar_url, user_id])
        .then(() => res.status(200).send({status: 'success'}))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static updateStatus(req, res) {
        const errors = {};
        const updateStatus = {
            user_id: req.user.id,
            newStatus : req.body.newStatus
        }
        if(!updateStatus.newStatus) {
            errors.newStatus = "Please provide a users's new status";
            return res.status(404).send(errors);
        }

        db.query(`UPDATE users SET status = $1, updated_date = NOW() WHERE id = $2`, [updateStatus.newStatus, updateStatus.user_id])
        .then(() => res.status(200).send(updateStatus))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static get(req, res) {
        let user_id =  req.body.user_id;

        db.query(`SELECT * FROM users WHERE id = $1`, [user_id])
        .then((result) => res.status(200).send(result.rows[0]))
        .catch(({ err }) => res.status(500).send({ err }));
    }

    static getByPhoto(req, res) {
        const photo_id = req.body.photo_id;
        db.query(`SELECT u.id AS user_id
                FROM users as u
                LEFT JOIN albums as a on a.user_id = u.id
                LEFT JOIN photos as p on p.album_id = a.id
                WHERE p.id = $1`, [photo_id])
            .then((result) => res.status(200).send(result.rows[0]))
            .catch(({ err }) => res.status(500).send({ err }));
    }

    static getAllUser(req, res) {
        const user_id = req.body.user_id;

        db.query(`SELECT * FROM users
                WHERE id 
                NOT IN (select client_id from contacts where user_id = $1) and id != $1`, [user_id])
            .then((result) => res.status(200).send(result.rows))
            .catch(({ err }) => res.status(500).send({ err }));                
    }

    // static async otpVerify(req, res, next) {
    //    try {
    //         const phone_number = req.body.phone_number;

    //         const otp = generateOTP(4);
    //         // save otp to user collection
    //         // user.phoneOtp = otp;
    //         // await user.save();
    //         // send otp to phone number
    //         await fast2sms(
    //           {
    //             message: `Your OTP is ${otp}`,
    //             contactNumber: phone_number,
    //           },
    //           next
    //         );
    //       } catch (error) {
    //         next(error);
    //       }
    //   }

}


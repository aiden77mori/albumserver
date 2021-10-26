const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../db');
const keys = require('./keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            const { id } = jwt_payload;

            db.query(`SELECT * FROM users WHERE id = $1`, [id]).then(result => {
                const user = result.rows[0];
                if(user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
            
        })
    );
};
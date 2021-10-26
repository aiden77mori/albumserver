const express = require('express');
const passport = require('passport');

const router = express.Router();
const Auth = passport.authenticate('jwt', { session: false });

// Load User Controller
const Visit = require('../../controllers/visitController');

// @route  POST api/visits/create
// @desc   Insert visit
// @access Private
router.route('/create')
    .post(Auth, Visit.create);

// @route  POST api/visits/get
// @desc   Get visit list by album id
// @access Public
router.route('/get')
    .post(Visit.get);

module.exports = router;
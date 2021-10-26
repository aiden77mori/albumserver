const express = require('express');
const passport = require('passport');

const router = express.Router();
const Auth = passport.authenticate('jwt', { session: false });

// Load Contact Controller
const Contact = require('../../controllers/contactController');

// @route  POST api/contacts/create
// @desc   Create contact
// @access Private
router.route('/create')
    .post(Auth, Contact.create);

// @route  POST api/contacts/get
// @desc   Get contacts list include search by phone number
// @access Private
router.route('/get')
    .post(Contact.get);

// @route  POST api/contacts/get
// @desc   Get recent contacts list
// @access Private
router.route('/getRecent')
    .post(Contact.getRecent);    

// @route  PUT api/contacts/block
// @desc   Block or Unblock user by user_id
// @access Private
router.route('/block')
    .put(Auth, Contact.block);

// @route  POST api/contacts/blockStatus
// @desc   Get Block Status by user_id and client_id
// @access Public
router.route('/blockStatus')
    .post(Contact.blockStatus);


module.exports = router;
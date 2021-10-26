const express = require('express');
const passport = require('passport');

const router = express.Router();
const Auth = passport.authenticate('jwt', { session: false });

// Load Contact Controller
const Album = require('../../controllers/albumController');

// @route  POST api/albums/create
// @desc   Create album name
// @access Private
router.route('/create')
    .post(Auth, Album.create);

// @route  POST api/albums/get
// @desc   Get albums by user_id
// @access Public
router.route('/get')
    .post(Album.get);

// @route  POST api/albums/edit
// @desc   Edit albums name by user_id
// @access Private
router.route('/edit')
    .put(Auth, Album.edit);

// @route  POST api/albums/edit
// @desc   Edit albums name by user_id
// @access Public
router.route('/getUserInfoByAlbumId')
    .post(Album.getUserInfoByAlbumId);

// @route  POST api/albums/getId
// @desc   Edit album id by photo_id
// @access Public
router.route('/getId')
    .post(Album.getId);

module.exports = router;
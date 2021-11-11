const express = require('express');
const passport = require('passport');

const router = express.Router();
const Auth = passport.authenticate('jwt', { session: false });

// Load Contact Controller
const Photo = require('../../controllers/photoController');

// @route  POST api/photos/save
// @desc   Save photo to any album
// @access Private
router.route('/save')
    .post(Auth, Photo.save);

// @route  POST api/photos/get
// @desc   Get a photo by photo_id
// @access Public
router.route('/get')
    .post(Photo.get);

router.route('/getRecent')
    .post(Photo.getRecent);

// @route  POST api/photos/get
// @desc   Get photos by album_id
// @access Public
router.route('/getByAlbum')
    .post(Photo.getAllByAlbum);    


// @route  POST api/photos/getUserInfoByPhotoId
// @desc   Get userinfo by photo_id
// @access Public
router.route('/getUserInfoByPhotoId')
    .post(Photo.getUserInfoByPhotoId);

// @route  PUT api/photos/edit
// @desc   Edit caption of photo by user
// @access Private
router.route('/edit')
    .put(Auth, Photo.edit);

// @route  DELETE api/photos/delete/:photo_id
// @desc   Delte photo by user
// @access Public
router.route('/delete/:photo_id')
    .delete(Photo.delete);

module.exports = router;
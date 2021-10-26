const express = require('express');
const passport = require('passport');

const router = express.Router();
const Auth = passport.authenticate('jwt', { session: false });

// Load Contact Controller
const Like = require('../../controllers/likeController');

// @route  POST api/likes/give
// @desc   Give like to photo
// @access Private
router.route('/give')
    .post(Auth, Like.give);

// @route  POST api/likes/get
// @desc   Get likes number by user, album, photo
// @access Public
router.route('/get')
    .post(Like.get);

// @route  POST api/likes/getLists
// @desc   Get likes lists by user id
// @access Public
router.route('/getLists')
    .post(Like.getLists);

// @route  POST api/likes/getLikesCount
// @desc   Get not checked likes count by user id
// @access Public
router.route('/getLikesCount')
    .post(Like.getLikesCount);

// @route  POST api/likes/getLikeStatus
// @desc   Get like_status by user_id and photo_id
// @access Public
router.route('/getLikeStatus')
    .post(Like.getLikeStatus);

module.exports = router;
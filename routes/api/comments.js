const express = require('express');
const passport = require('passport');

const router = express.Router();
const Auth = passport.authenticate('jwt', { session: false });

// Load Contact Controller
const Comment = require('../../controllers/commentController');

// @route  POST api/comments/create
// @desc   Create comments
// @access Private
router.route('/create')
    .post(Auth, Comment.create);

// @route  POST api/commnets/get
// @desc   Get comments by user_id, album_id, photo_id
// @access Public
router.route('/get')
    .post(Comment.get);

router.route('/getRecent')
    .post(Comment.getRecent);

// @route  POST api/commnets/getCount
// @desc   Get comments by user_id
// @access Public
router.route('/getCount')
    .post(Comment.getCount);

// @route  POST api/commnets/getNewCommentPhoto
// @desc   Get photos with new comments count by user_id
// @access Public
router.route('/getNewCommentPhoto')
    .post(Comment.getNewCommentPhoto);

module.exports = router;
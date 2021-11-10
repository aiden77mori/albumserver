const express = require('express');
const passport = require('passport');

const router = express.Router();
const Auth = passport.authenticate('jwt', { session: false });

// Load User Controller
const User = require('../../controllers/userController');

// @route GET api/users/test
// @desc Tests public users route
// @access Public
router.get('/test', (req, res) => res.json({message: 'user test'}));

// @route GET api/users/ptest
// @desc Tests private users route
// @access Private
router.get('/ptest', Auth, (req, res) => res.status(200).json(req.user));

// @route  POST api/users/register
// @desc   Register user
// @access Public
router.route('/register')
    .post(User.register);

// @route  POST api/users/otpVerify
// @desc   Verify otpCode
// @access Public
router.route('/otpverify')
    .post(User.otpverify);

// @route  POST api/users/resendOtp
// @desc   Resend phone number for otp
// @access Public
router.route('/resendOtp')
    .post(User.resendOtp);

// @route  POST api/users/updatePhoneNumber
// @desc   Change Phone Number in opt verify page
// @access Public
router.route('/updatePhoneNumber')
    .post(User.updatePhoneNumber);

// @route  POST api/users/login
// @desc   Login User
// @access Public
router.route('/login')
    .post(User.login);

// @route  PUT api/users/updateProfile
// @desc   Update profile
// @access Private
router.route('/updateProfile')
    .put(Auth, User.updateProfile);

// @route  PUT api/users/updateAvatar
// @desc   Update user avatar
// @access Private
router.route('/updateAvatar')
    .put(Auth, User.updateAvatar);

// @route  PUT api/users/updateStatus
// @desc   Update user status
// @access Private
router.route('/updateStatus')
    .put(Auth, User.updateStatus);

// @route  POST api/users/get
// @desc   Get user information
// @access Public
router.route('/get')
    .post(User.get);

// @route  post api/users/getByPhoto
// @desc   Get user information by photo_id
// @access Public
router.route('/getByPhoto')
    .post(User.getByPhoto);

// @route  post api/users/getAllUser
// @desc   Get user all user
// @access Public   
router.route('/getAllUser')
    .post(User.getAllUser);
    
// router.route('/otpVerify')
//     .post(User.otpVerify);

module.exports = router;
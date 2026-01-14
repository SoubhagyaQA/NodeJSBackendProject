const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const validator = require('../middlewares/validator');
const authController= require('../controllers/authController');

router.post('/register', validator.registerValidator, authController.registerUser);
router.post('/login',validator.loginValidator, authController.loginUser);
router.post('/update-user', authMiddleware.isAuthorized,validator.updateUserValidator, authController.updateUser);
router.post('/delete-user',authMiddleware.isAuthorized,validator.deleteUserValidator,authController.deleteUser);
router.get('/getall-user',authMiddleware.isAuthorized,authController.getAllUsers);
router.post('/otp-send',validator.sendOtpValidator,authController.sendOtp);

//router.post('/verify-otp',verifyOtp);


module.exports = router;




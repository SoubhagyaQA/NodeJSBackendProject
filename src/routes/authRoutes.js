const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const validator = require('../middlewares/validator');
const authController= require('../controllers/authController');
const civilConroller =require('../controllers/civilConroller');
const fileUploadController = require('../controllers/fileUploadController');
const upload = require('../middlewares/upload')
const { uploadResume, } = require("../middlewares/upload"); 
//const JobApply = require('../models/jobApply');

router.post('/register', validator.registerValidator, authController.registerUser);
router.post('/login',validator.loginValidator, authController.loginUser);
router.post('/update-user', authMiddleware.isAuthorized,validator.updateUserValidator, authController.updateUser);
router.post('/delete-user',authMiddleware.isAuthorized,validator.deleteUserValidator,authController.deleteUser);
router.get('/getall-user',authMiddleware.isAuthorized,authController.getAllUsers);
router.post('/otp-send',validator.sendOtpValidator,authController.sendOtp);
router.post('/apply-from-civil',validator.applyCivilEngineerValidator,civilConroller.applyCivilEngineer);
//router.post('/file-upload',upload.single('file'),fileUploadController.uploadFile);
// router.post('/file-upload', upload.single('file'), (req, res) => {
//     console.log('req.file:', req.file);  // <-- check if Multer received file
//     console.log('req.body:', req.body);  // <-- check additional fields
//     res.send('Check console');
// });
//Resume upload api
router.post("/apply-job",uploadResume.single("resume"),validator.jobApplicationValidator,fileUploadController.applyJob);

router.get('/get-selected-data', civilConroller.getSelectedData);
// Search API
router.get('/search', validator.searchUserValidator,civilConroller.searchUsers);

// Pagination API
router.get('/list', validator.paginationUserValidator, civilConroller.getUsersWithPagination );

//router.post('/verify-otp',verifyOtp);


module.exports = router;




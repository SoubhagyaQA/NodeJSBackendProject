const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const validator = require('../middlewares/validator');
const authController= require('../controllers/authController');
const civilConroller =require('../controllers/civilConroller');
const fileUploadController = require('../controllers/fileUploadController');
const { uploadImage, uploadResume } = require("../middlewares/upload");
const employeeController = require('../controllers/employeeController');


router.post('/register', validator.registerValidator, authController.registerUser);
router.post('/login',validator.loginValidator, authController.loginUser);
router.post('/update-user', authMiddleware.isAuthorized,validator.updateUserValidator, authController.updateUser);
router.post('/delete-user',authMiddleware.isAuthorized,validator.deleteUserValidator,authController.deleteUser);
router.get('/getall-user',authMiddleware.isAuthorized,authController.getAllUsers);
router.post('/otp-send',validator.sendOtpValidator,authController.sendOtp);
router.post('/apply-from-civil',validator.applyCivilEngineerValidator,civilConroller.applyCivilEngineer);
router.post('/upload-image',uploadImage.single('file'),fileUploadController.uploadFile);
router.post('/upload-resume',uploadResume.single('file'),fileUploadController.applyJob);
//Resume upload api
router.post("/apply-job",uploadResume.single("resume"),validator.jobApplicationValidator,fileUploadController.applyJob);
router.get('/get-selected-data', civilConroller.getSelectedData);
// Search API
router.get('/search', validator.searchUserValidator,civilConroller.searchUsers);
// Pagination API
router.get('/list', validator.paginationUserValidator, civilConroller.getUsersWithPagination );

//router.post('/verify-otp',verifyOtp);

// ADD EMPLOYEE
router.post("/add-employee",validator.employeeValidator,employeeController.addEmployee);
router.get("/list-employee",employeeController.listEmployees);
router.get("/view-employee/:id",employeeController.viewEmployee);
router.post("/edit-employee/:id",validator.employeeValidator,employeeController.editEmployee);
// Search Employee With Pagination
router.get("/search-employee",validator.searchEmployeeValidator,employeeController.searchEmployee);
router.get("/list-employee-pagination",validator.paginationValidator,employeeController.paginatedEmployees);

module.exports = router;
    



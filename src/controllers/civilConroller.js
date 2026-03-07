const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require ('../middlewares/validator')
const crypto = require('crypto');
const Otp = require('../models/otp');
const nodemailer = require('nodemailer');
const CivilEngineerApplication = require("../models/civil");
const JobApply = require('../models/jobApply');

const applyCivilEngineer = async (req, res) => {
  try {
    const {
      jobId,
      // Personal Details
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      dob,
      bloodGroup,
      gender,
      nationality,
      correspondenceAddress,
      permanentAddress,
      linkedInProfile,
      preferredLocation,

      // Last Education
      lastEducationalQualification,
      lastPassOutYear,
      lastPercentageOrCGPA,

      // Education Details (array)
      educationDetails,

      // Experience
      totalExperienceYears,
      workExperience,
      // Skills
      distinctiveSkill,
      technicalSkills,
      tpmKnowledge,
      fiveSKnowledge,
      googleSheetsSkill,
      industrySpecificSkills,
      additionalInformation
    } = req.body;

    // Basic required field check (as per UI *)
    if (
      !jobId ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !lastEducationalQualification ||
      !distinctiveSkill ||
      !technicalSkills
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }
// Duplicate email check
    const existingApplication = await CivilEngineerApplication.findOne({ email: email.toLowerCase() });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "An application with this email already exists."
      });
    }
    // Resume (PDF only from UI)
    let resume = {};
    if (req.file) {
      resume = {
        fileName: req.file.originalname,
        filePath: req.file.path,
        mimeType: req.file.mimetype
      };
    }

    const application = new CivilEngineerApplication({
      jobId,

      // Personal Details
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      dob,
      bloodGroup,
      gender,
      nationality,
      correspondenceAddress,
      permanentAddress,
      linkedInProfile,
      preferredLocation,

      // Education
      lastEducationalQualification,
      lastPassOutYear,
      lastPercentageOrCGPA,
      educationDetails,

      // Experience
      totalExperienceYears,
      workExperience,

      // Skills
      distinctiveSkill,
      technicalSkills,
      tpmKnowledge,
      fiveSKnowledge,
      googleSheetsSkill,
      industrySpecificSkills,
      additionalInformation,

      // Resume
      resume
    });

    await application.save();

    return res.status(201).json({
      success: true,
      message: "Civil Engineer application submitted successfully",
      data: application
    });

  } catch (error) {
    console.error("Apply Civil Engineer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/**
 * SEARCH API
 * Search by name, email, or phone
 */
const searchUsers = async (req, res) => {
  try {

    const { keyword } = req.query;

    const users = await User.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } }
      ]
    }).select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * PAGINATION API
 */
const getUsersWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      totalRecords: totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      data: users
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

const getSelectedData = async (req, res) => {
  try {
    // CivilEngineerApplications aggregation
    const civilData = await CivilEngineerApplication.aggregate([
      {
        $project: {
          _id: 0,
          department: 1,
          firstName: 1,
          permanentAddress: 1,
          bloodGroup: 1,
          lastEducationalQualification: 1,
          nationality: 1
        }
      }
    ]);

    const jobData = await JobApply.aggregate([
  {
    $project: {
      _id: 0,
      firstName: { $arrayElemAt: [{ $split: ["$name", " "] }, 0] }, 
      lastName: { $arrayElemAt: [{ $split: ["$name", " "] }, -1] }, 
      email: 1,
      phone: 1,
      experience: 1,
      jobId: 1
    }
  }
]);

    res.status(200).json({
      civilEngineerApplications: civilData,
      jobApplies: jobData
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports={
    applyCivilEngineer,
    searchUsers,
    getUsersWithPagination,
    getSelectedData
}
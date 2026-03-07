const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
  institute: { type: String, trim: true },
  degree: { type: String, trim: true },
  discipline: { type: String, trim: true },
  passOutYear: { type: Number },
  percentageOrCGPA: { type: String }
}, { _id: false });

const WorkExperienceSchema = new mongoose.Schema({
  companyName: { type: String, trim: true },
  designation: { type: String, trim: true },
  location: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  responsibilities: { type: String },
  Industry:{type:String,enum:["automobile","cement"]}
}, { _id: false });

const CivilEngineerApplicationSchema = new mongoose.Schema({
  //Job Details
  jobId: {type: String,required: true,index: true},
  jobTitle: {type: String,default: "Civil Engineer"},
  department: {type: String,default: "Central Projects"},

  //Personal Details
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {type: String,required: true,lowercase: true,trim: true},
  phoneNumber: {type: String,required: true,trim: true},
  dob: { type: Date },
  bloodGroup: {type: String,enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]},
  gender: {type: String,enum: ["Male", "Female", "Other"]},
  nationality: { type: String, default: "Indian" },
  correspondenceAddress: { type: String },
  permanentAddress: { type: String },
  linkedInProfile: { type: String },
  preferredLocation: { type: String },

  //Education
  lastEducationalQualification: {type: String,required: true},
  lastPassOutYear: { type: Number },
  lastPercentageOrCGPA: { type: String },
  educationDetails: [EducationSchema],

  //Experience
  totalExperienceYears: {type: String,enum: ["Fresher", "0-1", "1-3", "3-5", "5+"],default: "Fresher"},
  workExperience: [WorkExperienceSchema],

  //Skills
  distinctiveSkill: {type: String,required: true},
  technicalSkills: {type: String,required: true},
  tpmKnowledge: {type: Boolean,default: false},
  fiveSKnowledge: {type: Boolean,default: false},
  googleSheetsSkill: {type: Boolean,default: false},
  industrySpecificSkills: { type: String },
  additionalInformation: { type: String },

  //Resume
  resume: {
    fileName: String,
    filePath: String,
    mimeType: String
  },

  // System Fields
  applicationStatus: {
    type: String,
    enum: ["Submitted", "Under Review", "Shortlisted", "Rejected", "Selected"],
    default: "Submitted"
  },

  submittedAt: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "CivilEngineerApplication",
  CivilEngineerApplicationSchema
);

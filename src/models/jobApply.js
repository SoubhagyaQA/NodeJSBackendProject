const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    name: {type: String,required: true,trim: true},
    email: {type: String,required: true,lowercase: true,trim: true},
    phone: {type: String,required: true},
    jobId: {type: mongoose.Schema.Types.ObjectId,ref: "Job",required: true},
    experience: {type: Number,default: 0},
    coverLetter: {type: String,maxlength: 2000},
    resume: {fileName: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
        required: true,
      },
      fileSize: {
        type: Number, // bytes
        max: 10485760, // 10MB
      },
      mimeType: {
        type: String,
        enum: ["application/pdf"],
      },
    },

    status: {
      type: String,
      enum: ["applied", "reviewing", "shortlisted", "rejected", "hired"],
      default: "applied",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("jobApply", jobApplicationSchema);
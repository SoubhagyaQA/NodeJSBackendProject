const File = require('../models/FileUpload');
const jobApply = require('../models/jobApply');
const path = require("path");
const fs = require("fs");

const uploadFile = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
console.log('Received file:', req.file);
    const newFile = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const savedFile = await newFile.save();
    res.status(201).json(savedFile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all uploaded files
const getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Resume upload api
const applyJob = async (req, res) => {
  try {
    const { name, email, phone, jobId, experience, coverLetter } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }
const existingApplication = await jobApply.findOne({
  $or: [{ phone: phone }, { email: email }],
});

if (existingApplication) {
  return res.status(400).json({
    message: "User already applied for this job",
  });
}
    const application = new jobApply({
      name,
      email,
      phone,
      jobId,
      experience,
      coverLetter,

      resume: {
        fileName: req.file.filename,
        fileUrl: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      },
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Download Resume 
const downloadResume = async (req, res) => {
  try {
    const application = await jobApply.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (!application.resume || !application.resume.fileName) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      application.resume.fileName
    );

    // check file exists on server
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File not found on server",
      });
    }

    // download file
    res.download(filePath, application.resume.fileName);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }

};
module.exports = {
   uploadFile, 
   getFiles,
   applyJob,
   downloadResume
  };

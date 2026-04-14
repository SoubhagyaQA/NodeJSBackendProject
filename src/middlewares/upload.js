// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");


//   // CREATE FOLDERS IF NOT EXIST


// const imageFolder = path.join(__dirname, "../file-uploads/images");
// const resumeFolder = path.join(__dirname, "../file-uploads/resume");

// if (!fs.existsSync(imageFolder)) {
//   fs.mkdirSync(imageFolder, { recursive: true });
// }

// if (!fs.existsSync(resumeFolder)) {
//   fs.mkdirSync(resumeFolder, { recursive: true });
// }


//    //IMAGE UPLOAD CONFIG

// const imageStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, imageFolder);
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// function imageFilter(req, file, cb) {
//   if (!file.mimetype.startsWith("image/")) {
//     return cb(new Error("Only image files are allowed!"), false);
//   }
//   cb(null, true);
// }

// const uploadImage = multer({
//   storage: imageStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: imageFilter,
// });


//    //RESUME UPLOAD CONFIG

// const resumeStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, resumeFolder);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// function resumeFilter(req, file, cb) {
//   if (file.mimetype === "application/pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF files allowed"), false);
//   }
// }

// const uploadResume = multer({
//   storage: resumeStorage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
//   fileFilter: resumeFilter,
// });


//    //EXPORT BOTH


// module.exports = {
//   uploadImage,
//   uploadResume,
// };

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// CREATE FOLDERS IF NOT EXIST
const baseFolder = path.join(__dirname, "../file-uploads");
const imageFolder = path.join(baseFolder, "images");
const resumeFolder = path.join(baseFolder, "resume");

[baseFolder, imageFolder, resumeFolder].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// IMAGE UPLOAD CONFIG
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

function imageFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
}

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
});

// RESUME UPLOAD CONFIG (PDF only)
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

function resumeFilter(req, file, cb) {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed!"), false);
  }
}

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: resumeFilter,
});

module.exports = {
  uploadImage,
  uploadResume,
};

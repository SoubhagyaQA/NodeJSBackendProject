const Joi = require('joi');


// Register Validator
const registerValidator = async (req, res, next) => {
  try {
    const registerschema = Joi.object({
      name: Joi.string().min(3).max(30).required().messages({
        }),
  email: Joi.string().email().required().messages({
      'string-email': 'Email must be a valid email address',
    'any.required': 'Email is required',
        }),
           phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
          'string.pattern.base': 'Phone number should be 10 digits',
            'string-empty': 'Phone is required',
          'any.required': 'Phone is required',
    }),
              password: Joi.string().min(6).required().messages({
          'string.min': 'Password must be 6 characterslong',
          'any.required': 'Password is required',
        }),
      });
      const { error } = registerschema.validate(req.body, { abortEarly: false });

    if (error) {
    return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details.map((err) => err.message),
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
//LOGIN VALIDATOR
const loginValidator = async (req, res, next) => {
  try {
    const loginschema = Joi.object({
      email: Joi.string().email().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
        }),
    
   password: Joi.string().required().messages({
        'string.empty': 'Password is required',
          'any.required': 'Password is required',
      }),
    });
    const { error } = loginschema.validate(req.body, { abortEarly: false });

    if (error) {
  return res.status(400).json({
        status: 'error',
        message: 'validation failed',
        details: error.details.map((err) => err.message),
      });
    }
    next();
  } catch (error) {
       return res.status(500).json({
      status: 'error',
      message: ' server error',
    });
  }
};

//UPDATE USRE VALIDAROR

const updateUserValidator = (req, res, next) => {
  try{
  const updateschema = Joi.object({
  userId: Joi.string().required().messages({
      'string empty': 'User ID is required',
       ' any.required': 'User ID is required'
    }),
     name: Joi.string().min(3).max(30).optional().messages({
      
      'string-min':  'Name should be min 3 characters',
        'string-max': 'Name should bee max 30 characters',
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Email must be a valid email address'
    }),
    phone: Joi.number().phone().min(10).max(10).optional().message({
      ' Number.min ': 'Name should be  min 10 DigitNumber',
      'Number.max': 'Name should be max10 DigitNumber',
    }),
    password: Joi.string().min(6).optional().messages({
      'string.min': 'Password must be 6 characters long'
    }),
  });

  const { error } = updateschema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details.map((err) => err.message),
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: '500',
      message: 'server errorr',
    });
  }
};
// DELETE USER  VALIDATOR
const deleteUserValidator = (req, res, next) => {
  try {
    const deleteSchema = Joi.object({
      userId: Joi.string().required().messages({
        'string.empty': 'User ID is required',
        'any.required': 'User ID is required'
      }),
    });

    const { error } = deleteSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 'error',
         message: 'Validation failed',
        details: error.details.map((err) => err.message),
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
        status: 'error',
      message: 'Server error',
    });
  }
};

// const sendOtpValidator = (req, res, next) => {
//   try {
// const sendOtpSchema = Joi.object({
//   type: Joi.string().valid('email', 'sms').required(),
//   to: Joi.string().required()
// });
// const { error } = otpSchema.validate(req.body);

//     if (error) {
//       return res.status(400).json({
//         status: 'error',
//          message: 'Validation failed',
//         details: error.details.map((err) => err.message),
//       });
//     }
//     next();
//   } catch (error) {
//     return res.status(500).json({
//         status: 'error',
//       message: 'Server error',
//     });
//   }
// };

const sendOtpValidator = (req, res, next) => {
  try {
    const sendOtpSchema = Joi.object({
      type: Joi.string().valid('email', 'sms').required(),
      to: Joi.string().required()
    });

    
    const { error } = sendOtpSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details.map((err) => err.message),
      });
    }

    next();
  } catch (error) {
    console.error('Validator error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

const verifyOtpSchema = Joi.object({
  type: Joi.string().valid('email', 'sms').required(),
  to: Joi.string().required(),
  otp: Joi.string().length(6).required()
});


const applyCivilEngineerValidator = (req, res, next) => {
  try {
    const educationSchema = Joi.object({
      institute: Joi.string().allow(""),
      degree: Joi.string().allow(""),
      discipline: Joi.string().allow(""),
      passOutYear: Joi.number().integer().allow(null),
      percentageOrCGPA: Joi.string().allow("")
    });

    const workExperienceSchema = Joi.object({
      companyName: Joi.string().allow(""),
      designation: Joi.string().allow(""),
      location: Joi.string().allow(""),
      startDate: Joi.date().allow(null),
      endDate: Joi.date().allow(null),
      responsibilities: Joi.string().allow(""),
      Industry: Joi.string().valid("automobile", "cement").allow("")
    });

    const applySchema = Joi.object({
      // Job
      jobId: Joi.string().required().messages({
        "string.empty": "Job ID is required",
        "any.required": "Job ID is required"
      }),

      // Personal Details
      firstName: Joi.string().required().messages({
        "string.empty": "First name is required"
      }),
      middleName: Joi.string().allow(""),
      lastName: Joi.string().required().messages({
        "string.empty": "Last name is required"
      }),

      email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required"
      }),

      phoneNumber: Joi.string().required().messages({
        "string.empty": "Phone number is required"
      }),

      dob: Joi.date().allow(null),

      bloodGroup: Joi.string()
        .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
        .allow(null),

      gender: Joi.string()
        .valid("Male", "Female", "Other")
        .allow(null),

      nationality: Joi.string().allow("Indian"),

      correspondenceAddress: Joi.string().required().messages({
        "string.empty": "Correspondence address is required"
      }),

      permanentAddress: Joi.string().required().messages({
        "string.empty": "Permanent address is required"
      }),

      linkedInProfile: Joi.string().uri().allow(""),

      preferredLocation: Joi.string().required().messages({
        "string.empty": "Preferred location is required"
      }),

      // Last Education
      lastEducationalQualification: Joi.string().required().messages({
        "string.empty": "Last educational qualification is required"
      }),

      lastPassOutYear: Joi.number().integer().allow(null),
      lastPercentageOrCGPA: Joi.string().allow(""),

      // Education Details
      educationDetails: Joi.array().items(educationSchema).default([]),

      // Experience
      totalExperienceYears: Joi.string()
        .valid("Fresher", "0-1", "1-3", "3-5", "5+")
        .required()
        .messages({
          "any.only": "Invalid experience value",
          "any.required": "Experience is required"
        }),

      workExperience: Joi.array().items(workExperienceSchema).default([]),

      // Skills
      distinctiveSkill: Joi.string().required().messages({
        "string.empty": "Distinctive skill is required"
      }),

      technicalSkills: Joi.string().required().messages({
        "string.empty": "Technical skills are required"
      }),

      tpmKnowledge: Joi.boolean().default(false),
      fiveSKnowledge: Joi.boolean().default(false),
      googleSheetsSkill: Joi.boolean().default(false),

      industrySpecificSkills: Joi.string().allow(""),
      additionalInformation: Joi.string().allow("")
    });

    const { error } = applySchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        details: error.details.map((err) => err.message)
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};


const fileUploadrValidator = (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().min(3).max(100).optional(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details.map((err) => err.message),
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};


const searchUserValidator = (req, res, next) => {
  try {
    const schema = Joi.object({
      keyword: Joi.string().min(1).required(),
    });

    const { error } = schema.validate(req.query);

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details.map((err) => err.message),
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

const paginationUserValidator = (req, res, next) => {
  try {
    const schema = Joi.object({
      page: Joi.number().integer().min(1).required(),
      limit: Joi.number().integer().min(1).required(),
    });

    const { error } = schema.validate(req.query);

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details.map((err) => err.message),
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

const jobApplicationValidator = async (req, res, next) => {
  try {

    const schema = Joi.object({

      name: Joi.string().min(3).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters",
        "any.required": "Name is required"
      }),

      email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
      }),

      phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        "string.pattern.base": "Phone number must be 10 digits",
        "any.required": "Phone number is required"
      }),

      jobId: Joi.string().length(24).required().messages({
        "string.length": "Invalid Job ID",
        "any.required": "Job ID is required"
      }),

      experience: Joi.number().min(0).optional().messages({
        "number.base": "Experience must be a number"
      }),

      coverLetter: Joi.string().max(2000).optional().messages({
        "string.max": "Cover letter must be less than 2000 characters"
      })

    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        details: error.details.map((err) => err.message),
      });
    }

    next();

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};


module.exports = {
  registerValidator,
  loginValidator,
  updateUserValidator,
  deleteUserValidator,
  sendOtpValidator,
  applyCivilEngineerValidator,
  fileUploadrValidator,
  searchUserValidator,
  paginationUserValidator,
  jobApplicationValidator

};

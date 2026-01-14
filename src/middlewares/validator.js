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

module.exports = {
  registerValidator,
  loginValidator,
  updateUserValidator,
  deleteUserValidator,
  sendOtpValidator

};

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require ('../middlewares/validator')
const crypto = require('crypto');
const Otp = require('../models/otp');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password} = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) 
      return res.status(400).json({msg:'User already exists'});

    const hashedPassword = await bcrypt.hash(password, 10);
//console.log("========>",hashedPassword);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword
    });
    
    res.status(200).json({ 
      status: 201,
      msg: 'User registered successfully' });
      
  } catch (err) { 
    res.status(500).json({ 
      status: 500,
      msg: 'Server error', error: err.message });
  }
};

// GETALL REGISTERUSRE
const getAllUsers = async (_req, res) => {
  try {
    const users = await users.find();
    res.status(200).json(users);
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

//USER LOGIN 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg:'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Please enter valid Password' });

    const token = jwt.sign({ id:user._id },JWT_SECRET, { expiresIn:'8h' });

    return res.json({
      token,
      user: {
        id: user._id,
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


//USRE UPDATE
const updateUser = async (req, res) => {
  try {
    const { userId,name, email, password,} = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ msg: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'server error', error: err.message });
  }
};


//USER DELETE
const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const OTP_LENGTH = 6;
const MAX_ATTEMPTS = 5;

function generateOtp(length = OTP_LENGTH) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

function hashOtp(otp, salt) {
  return crypto.createHmac('sha256', salt).update(otp).digest('hex');
}

// Setup Nodemailer (You can configure via .env)
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOtp = async (req, res) => {
  const { type, to } = req.body;
  const otp = generateOtp();
  const salt = crypto.randomBytes(16).toString('hex');
  const otpHash = hashOtp(otp, salt);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  try {
    await Otp.findOneAndUpdate(
      { target: to, type },
      { otpHash, salt, expiresAt, attempts: 0 },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (type === 'email') {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      });
    } else if (type === 'sms') {
      // Send via SMS service like Twilio
      console.log(`Send SMS to ${to}: Your OTP is ${otp}`);
    }

    res.json({ ok: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


 // VERIFYOTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({email});
    if (!user) 
      return res.status(400).json({ msg: 'User not found' });

    if (user.isVerified) 
      return res.status(400).json({ msg: 'User already verified' });

    if (user.otp !== otp) 
      return res.status(400).json({ msg: 'Invalid OTP' });

    if (user.otpExpires < new Date()) 
      return res.status(400).json({ msg: 'OTP expired' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ msg: 'OTP verified. You can now login.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


module.exports={
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  sendOtp,
  verifyOtp
}
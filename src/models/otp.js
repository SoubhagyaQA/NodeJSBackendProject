
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  target: { type: String, required: true }, 
  type: { type: String, enum: ['email', 'sms'], required: true },
  otpHash: { type: String, required: true },
  salt: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
}, { timestamps: true });

otpSchema.index({ target: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Otp', otpSchema);

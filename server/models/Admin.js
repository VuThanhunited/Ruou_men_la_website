const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: 6,
      select: false,
    },
    name: { type: String, default: 'Admin Yến Nhi' },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const { wrapModel } = require('../config/jsonStore');

module.exports = wrapModel(mongoose.model('Admin', adminSchema));

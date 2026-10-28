const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
  }
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
  }
  res.json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    },
  });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, data: req.admin });
};

// PUT /api/auth/change-password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id).select('+password');
  if (!(await admin.matchPassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
  }
  admin.password = newPassword;
  await admin.save();
  res.json({ success: true, message: 'Đổi mật khẩu thành công' });
};

module.exports = { login, getMe, changePassword };

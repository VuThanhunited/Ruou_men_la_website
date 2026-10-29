const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const isRealValue = (val) =>
  Boolean(val && val.trim() && !val.startsWith('your_'));

const hasCloudinary =
  isRealValue(process.env.CLOUDINARY_CLOUD_NAME) &&
  isRealValue(process.env.CLOUDINARY_API_KEY) &&
  isRealValue(process.env.CLOUDINARY_API_SECRET);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const getSubFolder = (req) =>
  (req.uploadFolder || 'ruou-men-la/general').replace(/^ruou-men-la\/?/, '') || 'general';

const storage = hasCloudinary
  ? new CloudinaryStorage({
      cloudinary,
      params: (req) => {
        const folder = req.uploadFolder || 'ruou-men-la/general';
        return {
          folder,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'],
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        };
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const subFolder = getSubFolder(req);
        const dest = path.join(__dirname, '..', 'uploads', subFolder);
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.webp';
        const safeName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        cb(null, safeName);
      },
    });

const rawUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const normalizeFileUrl = (req, file) => {
  if (!file || hasCloudinary) return;
  const subFolder = getSubFolder(req);
  const baseUrl = process.env.SERVER_PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  file.path = `${baseUrl}/uploads/${subFolder}/${file.filename}`;
};

const wrapMiddleware = (mw) => (req, res, next) => {
  mw(req, res, (err) => {
    if (err) return next(err);
    if (req.file) normalizeFileUrl(req, req.file);
    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach((f) => normalizeFileUrl(req, f));
      } else {
        Object.values(req.files).forEach((arr) =>
          arr.forEach((f) => normalizeFileUrl(req, f))
        );
      }
    }
    next();
  });
};

const upload = {
  single: (fieldName) => wrapMiddleware(rawUpload.single(fieldName)),
  fields: (fieldsConfig) => wrapMiddleware(rawUpload.fields(fieldsConfig)),
  array: (fieldName, maxCount) => wrapMiddleware(rawUpload.array(fieldName, maxCount)),
};

module.exports = { cloudinary, upload, hasCloudinary };

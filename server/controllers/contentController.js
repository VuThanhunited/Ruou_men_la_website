const {
  Hero,
  UspFeature,
  Intro,
  Product,
  Process,
  ProcessStep,
  BrandStory,
  Testimonial,
  SiteConfig,
  Subscriber,
} = require('../models/Content');
const { cloudinary } = require('../config/cloudinary');

// Helper: lấy dữ liệu singleton hoặc tạo mới nếu chưa có
const getSingleton = async (Model) => {
  let doc = await Model.findOne();
  if (!doc) doc = await Model.create({});
  return doc;
};

// ============================================================
// HERO
// ============================================================
exports.getHero = async (req, res) => {
  const data = await getSingleton(Hero);
  res.json({ success: true, data });
};

exports.updateHero = async (req, res) => {
  let doc = await Hero.findOne();
  const updateData = { ...req.body };

  // Xử lý upload ảnh
  if (req.files?.logoUrl?.[0]) updateData.logoUrl = req.files.logoUrl[0].path;
  if (req.files?.heroBgUrl?.[0]) updateData.heroBgUrl = req.files.heroBgUrl[0].path;
  if (req.files?.heroProductUrl?.[0]) updateData.heroProductUrl = req.files.heroProductUrl[0].path;
  if (req.files?.sideBannerBgUrl?.[0]) updateData.sideBannerBgUrl = req.files.sideBannerBgUrl[0].path;

  if (!doc) {
    doc = await Hero.create(updateData);
  } else {
    doc = await Hero.findByIdAndUpdate(doc._id, updateData, { new: true, runValidators: true });
  }
  res.json({ success: true, data: doc });
};

// ============================================================
// USP FEATURES
// ============================================================
exports.getUspFeatures = async (req, res) => {
  const data = await UspFeature.find({ isActive: true }).sort('order');
  res.json({ success: true, data });
};

exports.getAllUspFeatures = async (req, res) => {
  const data = await UspFeature.find().sort('order');
  res.json({ success: true, data });
};

exports.createUspFeature = async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.iconUrl = req.file.path;
  const data = await UspFeature.create(updateData);
  res.status(201).json({ success: true, data });
};

exports.updateUspFeature = async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.iconUrl = req.file.path;
  const data = await UspFeature.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  res.json({ success: true, data });
};

exports.deleteUspFeature = async (req, res) => {
  const data = await UspFeature.findByIdAndDelete(req.params.id);
  if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  res.json({ success: true, message: 'Đã xóa thành công' });
};

// ============================================================
// INTRO
// ============================================================
exports.getIntro = async (req, res) => {
  const data = await getSingleton(Intro);
  res.json({ success: true, data });
};

exports.updateIntro = async (req, res) => {
  let doc = await Intro.findOne();
  const updateData = { ...req.body };
  if (req.file) updateData.introBannerUrl = req.file.path;
  if (!doc) {
    doc = await Intro.create(updateData);
  } else {
    doc = await Intro.findByIdAndUpdate(doc._id, updateData, { new: true, runValidators: true });
  }
  res.json({ success: true, data: doc });
};

// ============================================================
// PRODUCTS
// ============================================================
exports.getProducts = async (req, res) => {
  const filter = { isActive: true };
  if (req.query.featured === 'true') filter.isFeatured = true;
  const data = await Product.find(filter).sort('order');
  res.json({ success: true, data });
};

exports.getAllProducts = async (req, res) => {
  const data = await Product.find().sort('order');
  res.json({ success: true, data });
};

exports.getProduct = async (req, res) => {
  const data = await Product.findById(req.params.id);
  if (!data) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
  res.json({ success: true, data });
};

exports.createProduct = async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.thumbnailUrl = req.file.path;
  // Tự động tạo slug từ tên
  if (updateData.name && !updateData.slug) {
    updateData.slug = updateData.name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
  const data = await Product.create(updateData);
  res.status(201).json({ success: true, data });
};

exports.updateProduct = async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.thumbnailUrl = req.file.path;
  const data = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!data) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
  res.json({ success: true, data });
};

exports.deleteProduct = async (req, res) => {
  const data = await Product.findByIdAndDelete(req.params.id);
  if (!data) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
  res.json({ success: true, message: 'Đã xóa sản phẩm' });
};

// ============================================================
// PROCESS
// ============================================================
exports.getProcess = async (req, res) => {
  const section = await getSingleton(Process);
  const steps = await ProcessStep.find({ isActive: true }).sort('stepNumber');
  res.json({ success: true, data: { section, steps } });
};

exports.updateProcessSection = async (req, res) => {
  let doc = await Process.findOne();
  const updateData = { ...req.body };
  if (req.file) updateData.decorBgUrl = req.file.path;
  if (!doc) {
    doc = await Process.create(updateData);
  } else {
    doc = await Process.findByIdAndUpdate(doc._id, updateData, { new: true });
  }
  res.json({ success: true, data: doc });
};

exports.getAllProcessSteps = async (req, res) => {
  const data = await ProcessStep.find().sort('stepNumber');
  res.json({ success: true, data });
};

exports.createProcessStep = async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.imageUrl = req.file.path;
  const data = await ProcessStep.create(updateData);
  res.status(201).json({ success: true, data });
};

exports.updateProcessStep = async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.imageUrl = req.file.path;
  const data = await ProcessStep.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  res.json({ success: true, data });
};

exports.deleteProcessStep = async (req, res) => {
  const data = await ProcessStep.findByIdAndDelete(req.params.id);
  if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  res.json({ success: true, message: 'Đã xóa' });
};

// ============================================================
// BRAND STORY
// ============================================================
exports.getBrandStory = async (req, res) => {
  const data = await getSingleton(BrandStory);
  res.json({ success: true, data });
};

exports.updateBrandStory = async (req, res) => {
  let doc = await BrandStory.findOne();
  const updateData = { ...req.body };
  if (req.file) updateData.storyBgUrl = req.file.path;
  if (!doc) {
    doc = await BrandStory.create(updateData);
  } else {
    doc = await BrandStory.findByIdAndUpdate(doc._id, updateData, { new: true });
  }
  res.json({ success: true, data: doc });
};

// ============================================================
// TESTIMONIALS
// ============================================================
exports.getTestimonials = async (req, res) => {
  const data = await Testimonial.find({ isActive: true }).sort('order');
  res.json({ success: true, data });
};

exports.getAllTestimonials = async (req, res) => {
  const data = await Testimonial.find().sort('order');
  res.json({ success: true, data });
};

exports.createTestimonial = async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.avatarUrl = req.file.path;
  const data = await Testimonial.create(updateData);
  res.status(201).json({ success: true, data });
};

exports.updateTestimonial = async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.avatarUrl = req.file.path;
  const data = await Testimonial.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  res.json({ success: true, data });
};

exports.deleteTestimonial = async (req, res) => {
  const data = await Testimonial.findByIdAndDelete(req.params.id);
  if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  res.json({ success: true, message: 'Đã xóa' });
};

// ============================================================
// SITE CONFIG
// ============================================================
exports.getSiteConfig = async (req, res) => {
  const data = await getSingleton(SiteConfig);
  res.json({ success: true, data });
};

exports.updateSiteConfig = async (req, res) => {
  let doc = await SiteConfig.findOne();
  const updateData = { ...req.body };
  if (req.file) updateData.footerLogoUrl = req.file.path;
  if (!doc) {
    doc = await SiteConfig.create(updateData);
  } else {
    doc = await SiteConfig.findByIdAndUpdate(doc._id, updateData, { new: true });
  }
  res.json({ success: true, data: doc });
};

// ============================================================
// NEWSLETTER
// ============================================================
exports.subscribe = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Vui lòng nhập email' });
  const existing = await Subscriber.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email đã đăng ký nhận tin' });
  }
  await Subscriber.create({ email });
  res.status(201).json({ success: true, message: 'Đăng ký nhận tin thành công!' });
};

exports.getAllSubscribers = async (req, res) => {
  const data = await Subscriber.find().sort('-createdAt');
  res.json({ success: true, data });
};

// ============================================================
// DASHBOARD STATS
// ============================================================
exports.getDashboardStats = async (req, res) => {
  const [products, testimonials, subscribers, processSteps] = await Promise.all([
    Product.countDocuments(),
    Testimonial.countDocuments(),
    Subscriber.countDocuments(),
    ProcessStep.countDocuments(),
  ]);
  res.json({
    success: true,
    data: { products, testimonials, subscribers, processSteps },
  });
};

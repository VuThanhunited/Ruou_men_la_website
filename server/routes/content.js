const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contentController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Middleware gán folder upload
const setFolder = (folder) => (req, res, next) => {
  req.uploadFolder = `ruou-men-la/${folder}`;
  next();
};

// ============================
// PUBLIC ROUTES (Landing Page)
// ============================
router.get('/hero', ctrl.getHero);
router.get('/usp', ctrl.getUspFeatures);
router.get('/intro', ctrl.getIntro);
router.get('/products', ctrl.getProducts);
router.get('/products/:id', ctrl.getProduct);
router.get('/process', ctrl.getProcess);
router.get('/brand-story', ctrl.getBrandStory);
router.get('/news', ctrl.getNews);
router.get('/testimonials', ctrl.getTestimonials);
router.get('/site-config', ctrl.getSiteConfig);
router.post('/subscribe', ctrl.subscribe);

// ============================
// ADMIN ROUTES (Protected)
// ============================

// Dashboard
router.get('/admin/stats', protect, ctrl.getDashboardStats);

// Hero
router.put(
  '/admin/hero',
  protect,
  setFolder('hero'),
  upload.fields([
    { name: 'logoUrl', maxCount: 1 },
    { name: 'heroBgUrl', maxCount: 1 },
    { name: 'heroProductUrl', maxCount: 1 },
    { name: 'sideBannerBgUrl', maxCount: 1 },
  ]),
  ctrl.updateHero
);

// USP Features
router.get('/admin/usp', protect, ctrl.getAllUspFeatures);
router.post('/admin/usp', protect, setFolder('usp'), upload.single('iconUrl'), ctrl.createUspFeature);
router.put('/admin/usp/:id', protect, setFolder('usp'), upload.single('iconUrl'), ctrl.updateUspFeature);
router.delete('/admin/usp/:id', protect, ctrl.deleteUspFeature);

// Intro
router.put(
  '/admin/intro',
  protect,
  setFolder('intro'),
  upload.single('introBannerUrl'),
  ctrl.updateIntro
);

// Products
router.get('/admin/products', protect, ctrl.getAllProducts);
router.post('/admin/products', protect, setFolder('products'), upload.single('thumbnailUrl'), ctrl.createProduct);
router.put('/admin/products/:id', protect, setFolder('products'), upload.single('thumbnailUrl'), ctrl.updateProduct);
router.delete('/admin/products/:id', protect, ctrl.deleteProduct);

// Process
router.put('/admin/process/section', protect, setFolder('process'), upload.single('decorBgUrl'), ctrl.updateProcessSection);
router.get('/admin/process/steps', protect, ctrl.getAllProcessSteps);
router.post('/admin/process/steps', protect, setFolder('process'), upload.single('imageUrl'), ctrl.createProcessStep);
router.put('/admin/process/steps/:id', protect, setFolder('process'), upload.single('imageUrl'), ctrl.updateProcessStep);
router.delete('/admin/process/steps/:id', protect, ctrl.deleteProcessStep);

// Brand Story
router.put('/admin/brand-story', protect, setFolder('brand-story'), upload.single('storyBgUrl'), ctrl.updateBrandStory);

// News / Articles
router.get('/admin/news', protect, ctrl.getAllNews);
router.post('/admin/news', protect, setFolder('news'), upload.single('imageUrl'), ctrl.createNews);
router.put('/admin/news/:id', protect, setFolder('news'), upload.single('imageUrl'), ctrl.updateNews);
router.delete('/admin/news/:id', protect, ctrl.deleteNews);

// Testimonials
router.get('/admin/testimonials', protect, ctrl.getAllTestimonials);
router.post('/admin/testimonials', protect, setFolder('testimonials'), upload.single('avatarUrl'), ctrl.createTestimonial);
router.put('/admin/testimonials/:id', protect, setFolder('testimonials'), upload.single('avatarUrl'), ctrl.updateTestimonial);
router.delete('/admin/testimonials/:id', protect, ctrl.deleteTestimonial);

// Site Config & Theme
router.put('/admin/site-config', protect, setFolder('config'), upload.single('footerLogoUrl'), ctrl.updateSiteConfig);
router.put('/admin/theme', protect, ctrl.updateTheme);

// Newsletter Subscribers
router.get('/admin/subscribers', protect, ctrl.getAllSubscribers);

module.exports = router;

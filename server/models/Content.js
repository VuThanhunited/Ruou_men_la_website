const mongoose = require('mongoose');

// ============================================================
// 1. HERO SECTION SCHEMA
// ============================================================
const heroSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: '' },
    heroBgUrl: { type: String, default: '' },
    heroProductUrl: { type: String, default: '' }, // Ảnh chum rượu foreground PNG
    title: { type: String, default: 'Rượu Men Lá' },
    subtitle: { type: String, default: 'Hương vị truyền thống từ núi rừng quê hương' },
    description: {
      type: String,
      default:
        'Rượu Men Lá Yến Nhi được ủ từ những nguyên liệu thiên nhiên, kết tinh hoa của núi rừng và bàn tay người dân tộc, mang đến hương vị đậm đà, mộc mạc, tốt cho sức khỏe.',
    },
    ctaText: { type: String, default: 'KHÁM PHÁ SẢN PHẨM' },
    ctaLink: { type: String, default: '/san-pham' },
    hotline: { type: String, default: '0866.603.589' },
    sideBannerText: { type: String, default: 'Rượu sạch từ thiên nhiên' },
    sideBannerBgUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// ============================================================
// 2. USP FEATURE SCHEMA (5 điểm nổi bật)
// ============================================================
const uspFeatureSchema = new mongoose.Schema({
  iconUrl: { type: String, default: '' },
  title: { type: String, required: true },
  subTitle: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

// ============================================================
// 3. INTRO SECTION SCHEMA
// ============================================================
const introSchema = new mongoose.Schema(
  {
    introBannerUrl: { type: String, default: '' },
    title: { type: String, default: 'Tinh hoa Men Lá Việt' },
    description: {
      type: String,
      default:
        'Rượu Men Lá Yến Nhi là sự kết hợp hài hòa giữa bí quyết dân gian và nguồn nguyên liệu thiên nhiên, mang đến hương vị độc đáo, đậm đà bản sắc quê hương.',
    },
    buttonText: { type: String, default: 'TÌM HIỂU NGAY' },
    buttonLink: { type: String, default: '/gioi-thieu' },
  },
  { timestamps: true }
);

// ============================================================
// 4. PRODUCT SCHEMA
// ============================================================
const productSchema = new mongoose.Schema(
  {
    thumbnailUrl: { type: String, default: '' },
    name: { type: String, required: true },
    volume: { type: String, default: '' }, // Dung tích (500ml, 750ml, v.v.)
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    slug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

// ============================================================
// 5. PRODUCTION PROCESS SCHEMA
// ============================================================
const processSchema = new mongoose.Schema(
  {
    sectionTitle: { type: String, default: 'QUY TRÌNH SẢN XUẤT' },
    sectionSubtitle: { type: String, default: 'Giữ trọn hương vị tự nhiên' },
    sectionDescription: {
      type: String,
      default:
        'Rượu Men Lá Yến Nhi được làm từ gạo nếp chọn lọc, men lá rừng truyền thống, ủ thủ công theo bí quyết dân gian, đảm bảo hương vị thuần khiết và an toàn cho sức khỏe.',
    },
    buttonText: { type: String, default: 'XEM CHI TIẾT QUY TRÌNH' },
    buttonLink: { type: String, default: '/quy-trinh' },
    decorBgUrl: { type: String, default: '' }, // Ảnh họa tiết lá nền
  },
  { timestamps: true }
);

const processStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
});

// ============================================================
// 6. BRAND STORY SCHEMA
// ============================================================
const brandStorySchema = new mongoose.Schema(
  {
    storyBgUrl: { type: String, default: '' },
    title: { type: String, default: 'CÂU CHUYỆN THƯƠNG HIỆU' },
    subTitle: { type: String, default: 'Hương rượu từ núi rừng' },
    description: {
      type: String,
      default:
        'Hợp tác xã Dịch Vụ Thương mại Yến Nhi ra đời với mong muốn lưu giữ và phát huy giá trị rượu men lá truyền thống của quê hương, đưa hương vị đặc trưng của núi rừng đến gần hơn với mọi gia đình.',
    },
    buttonText: { type: String, default: 'VỀ CHÚNG TÔI' },
    buttonLink: { type: String, default: '/gioi-thieu' },
  },
  { timestamps: true }
);

// ============================================================
// 7. TESTIMONIAL SCHEMA
// ============================================================
const testimonialSchema = new mongoose.Schema(
  {
    avatarUrl: { type: String, default: '' },
    comment: { type: String, required: true },
    customerName: { type: String, required: true },
    location: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ============================================================
// 8. FOOTER / SITE CONFIG SCHEMA
// ============================================================
const siteConfigSchema = new mongoose.Schema(
  {
    footerLogoUrl: { type: String, default: '' },
    companyName: {
      type: String,
      default: 'Hợp tác xã Dịch Vụ Thương mại Yến Nhi',
    },
    address: {
      type: String,
      default: 'Thôn Xín Chải, Xã Sơn Vĩ, Tỉnh Tuyên Quang',
    },
    phone1: { type: String, default: '0866.603.589' },
    phone2: { type: String, default: '0812.838.589' },
    email: { type: String, default: 'yen.nhi.ruoumenla@gmail.com' },
    facebookUrl: { type: String, default: '#' },
    instagramUrl: { type: String, default: '#' },
    tiktokUrl: { type: String, default: '#' },
    zaloUrl: { type: String, default: '#' },
    metaTitle: {
      type: String,
      default: 'Rượu Men Lá Yến Nhi - Hương vị truyền thống từ núi rừng',
    },
    metaDescription: {
      type: String,
      default:
        'Rượu Men Lá Yến Nhi - Sản phẩm rượu truyền thống từ men lá rừng, nguyên liệu thiên nhiên, an toàn sức khỏe, hương vị đặc trưng vùng núi Tuyên Quang.',
    },
  },
  { timestamps: true }
);

// ============================================================
// 9. NEWSLETTER SUBSCRIBER SCHEMA
// ============================================================
const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = {
  Hero: mongoose.model('Hero', heroSchema),
  UspFeature: mongoose.model('UspFeature', uspFeatureSchema),
  Intro: mongoose.model('Intro', introSchema),
  Product: mongoose.model('Product', productSchema),
  Process: mongoose.model('Process', processSchema),
  ProcessStep: mongoose.model('ProcessStep', processStepSchema),
  BrandStory: mongoose.model('BrandStory', brandStorySchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  SiteConfig: mongoose.model('SiteConfig', siteConfigSchema),
  Subscriber: mongoose.model('Subscriber', subscriberSchema),
};

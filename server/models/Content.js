const mongoose = require('mongoose');

// ============================================================
// 1. HERO SECTION SCHEMA
// ============================================================
const heroSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: '/assets/logo.jpg' },
    heroBgUrl: { type: String, default: '/assets/hero-bg.jpg' },
    heroProductUrl: { type: String, default: '' }, // Ảnh chum rượu foreground PNG
    title: { type: String, default: 'Rượu\nMen Lá' },
    subtitle: { type: String, default: 'Hương vị truyền thống từ núi rừng quê hương' },
    description: {
      type: String,
      default:
        'Rượu Men Lá Yến Nhi được ủ từ những nguyên liệu thiên nhiên, kết tinh hoa của núi rừng và bàn tay người dân tộc, mang đến hương vị đậm đà, mộc mạc, tốt cho sức khỏe.',
    },
    ctaText: { type: String, default: 'KHÁM PHÁ SẢN PHẨM' },
    ctaLink: { type: String, default: '#san-pham' },
    hotline: { type: String, default: '0372.477.078' },
    sideBannerText: { type: String, default: 'Rượu\nsạch từ\nthiên nhiên' },
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
    introBannerUrl: { type: String, default: '/assets/intro-bg.jpg' },
    title: { type: String, default: 'Tinh hoa\nMen Lá Việt' },
    description: {
      type: String,
      default:
        'Rượu Men Lá Yến Nhi là sự kết hợp hài hòa giữa bí quyết dân gian và nguồn nguyên liệu thiên nhiên, mang đến hương vị độc đáo, đậm đà bản sắc quê hương.',
    },
    buttonText: { type: String, default: 'TÌM HIỂU NGAY' },
    buttonLink: { type: String, default: '#gioi-thieu' },
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
    ingredients: {
      type: String,
      default: 'Gạo nếp nương, men lá 20+ vị thuốc thảo dược rừng',
    },
    method: {
      type: String,
      default: 'Ủ chum sành hạ thổ truyền thống',
    },
    alcoholContent: {
      type: String,
      default: '~ 29° - 32° Vol (Êm say vừa vặn)',
    },
    origin: {
      type: String,
      default: 'HTX Dịch Vụ Thương Mại Yến Nhi - Bắc Ninh',
    },
    badge: {
      type: String,
      default: 'Ủ CHUM SÀNH TRUYỀN THỐNG',
    },
    isFeatured: { type: Boolean, default: true },
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
    buttonLink: { type: String, default: '#quy-trinh' },
    decorBgUrl: { type: String, default: '' }, // Ảnh họa tiết lá nền
  },
  { timestamps: true }
);

const processStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  detailTitle: { type: String, default: '' },
  lead: { type: String, default: '' },
  details: { type: [String], default: [] },
  secret: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
});

// ============================================================
// 6. BRAND STORY SCHEMA
// ============================================================
const brandStorySchema = new mongoose.Schema(
  {
    storyBgUrl: { type: String, default: '/assets/brand-story-bg.jpg' },
    title: { type: String, default: 'CÂU CHUYỆN THƯƠNG HIỆU' },
    subTitle: { type: String, default: 'Hương rượu từ núi rừng' },
    description: {
      type: String,
      default:
        'Hợp tác xã Dịch Vụ Thương mại Yến Nhi ra đời với mong muốn lưu giữ và phát huy giá trị rượu men lá truyền thống của quê hương, đưa hương vị đặc trưng của núi rừng đến gần hơn với mọi gia đình.',
    },
    buttonText: { type: String, default: 'VỀ CHÚNG TÔI' },
    buttonLink: { type: String, default: '#gioi-thieu' },
  },
  { timestamps: true }
);

// ============================================================
// 7. NEWS / ARTICLE SCHEMA
// ============================================================
const newsSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, default: '' },
    category: { type: String, default: 'Tin Tức HTX' },
    date: { type: String, default: '' },
    readTime: { type: String, default: '3 phút đọc' },
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    content: { type: [String], default: [] },
    quote: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ============================================================
// 8. TESTIMONIAL SCHEMA
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
// 9. FOOTER / SITE CONFIG & THEME SCHEMA
// ============================================================
const siteConfigSchema = new mongoose.Schema(
  {
    footerLogoUrl: { type: String, default: '/assets/logo.jpg' },
    companyName: {
      type: String,
      default: 'Hợp tác xã Dịch Vụ Thương mại Yến Nhi',
    },
    address: {
      type: String,
      default: 'Thôn Tân Đồng, Xã Nam Dương, Thành Phố Bắc Ninh',
    },
    phone1: { type: String, default: '0372.477.078' },
    phone2: { type: String, default: '' },
    email: { type: String, default: 'yen.nhi.ruoumenla@gmail.com' },
    facebookUrl: { type: String, default: '#' },
    instagramUrl: { type: String, default: '#' },
    youtubeUrl: { type: String, default: '#' },
    tiktokUrl: { type: String, default: '#' },
    zaloUrl: { type: String, default: '#' },
    metaTitle: {
      type: String,
      default: 'Rượu Men Lá Yến Nhi - Hương vị truyền thống từ núi rừng',
    },
    metaDescription: {
      type: String,
      default:
        'Rượu Men Lá Yến Nhi - Sản phẩm rượu truyền thống từ men lá rừng, nguyên liệu thiên nhiên, an toàn sức khỏe, hương vị đặc trưng.',
    },
    theme: {
      preset: { type: String, default: 'forest' },
      primaryColor: { type: String, default: '#1C3319' },
      primaryDarkColor: { type: String, default: '#122210' },
      primaryLightColor: { type: String, default: '#2D5229' },
      accentGoldColor: { type: String, default: '#C59B5F' },
      accentBrownColor: { type: String, default: '#8C5A2B' },
      bgColor: { type: String, default: '#F4EFE6' },
      bgAltColor: { type: String, default: '#FAF6F0' },
      textDarkColor: { type: String, default: '#1E271D' },
      textLightColor: { type: String, default: '#F5EFE0' },
      fontScript: { type: String, default: "'Dancing Script', cursive" },
      fontSerif: { type: String, default: "'Lora', 'Playfair Display', Georgia, serif" },
      fontSans: { type: String, default: "'Be Vietnam Pro', 'Montserrat', sans-serif" },
      heroOverlayOpacity: { type: Number, default: 85 },
      storyOverlayOpacity: { type: Number, default: 88 },
      showUsp: { type: Boolean, default: true },
      showIntro: { type: Boolean, default: true },
      showProducts: { type: Boolean, default: true },
      showProcess: { type: Boolean, default: true },
      showBrandStory: { type: Boolean, default: true },
      showNews: { type: Boolean, default: true },
      showTestimonials: { type: Boolean, default: true },
      sectionOrder: {
        type: [String],
        default: ['usp', 'split', 'process', 'brandStory', 'news', 'testimonials'],
      },
    },
  },
  { timestamps: true }
);

// ============================================================
// 10. NEWSLETTER SUBSCRIBER SCHEMA
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

const { wrapModel } = require('../config/jsonStore');

module.exports = {
  Hero: wrapModel(mongoose.model('Hero', heroSchema)),
  UspFeature: wrapModel(mongoose.model('UspFeature', uspFeatureSchema)),
  Intro: wrapModel(mongoose.model('Intro', introSchema)),
  Product: wrapModel(mongoose.model('Product', productSchema)),
  Process: wrapModel(mongoose.model('Process', processSchema)),
  ProcessStep: wrapModel(mongoose.model('ProcessStep', processStepSchema)),
  BrandStory: wrapModel(mongoose.model('BrandStory', brandStorySchema)),
  News: wrapModel(mongoose.model('News', newsSchema)),
  Testimonial: wrapModel(mongoose.model('Testimonial', testimonialSchema)),
  SiteConfig: wrapModel(mongoose.model('SiteConfig', siteConfigSchema)),
  Subscriber: wrapModel(mongoose.model('Subscriber', subscriberSchema)),
};

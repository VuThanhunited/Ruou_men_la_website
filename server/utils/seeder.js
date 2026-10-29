const Admin = require('../models/Admin');
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
} = require('../models/Content');

const seed = async () => {
  console.log('🌱 Bắt đầu seed dữ liệu mẫu...');

  // Admin
  const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@ruoumenla.vn',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      name: 'Admin Yến Nhi',
    });
    console.log('✅ Admin account created');
  }

  // Hero
  const heroExists = await Hero.findOne();
  if (!heroExists) {
    await Hero.create({
      title: 'Rượu Men Lá',
      subtitle: 'Hương vị truyền thống từ núi rừng quê hương',
      description:
        'Rượu Men Lá Yến Nhi được ủ từ những nguyên liệu thiên nhiên, kết tinh hoa của núi rừng và bàn tay người dân tộc, mang đến hương vị đậm đà, mộc mạc, tốt cho sức khỏe.',
      ctaText: 'KHÁM PHÁ SẢN PHẨM',
      hotline: '0372.477.078',
      sideBannerText: 'Rượu sạch từ thiên nhiên',
    });
    console.log('✅ Hero data seeded');
  }

  // USP Features
  const uspCount = await UspFeature.countDocuments();
  if (uspCount === 0) {
    await UspFeature.insertMany([
      { title: 'Nguyên liệu thiên nhiên', subTitle: 'Men lá rừng truyền thống', order: 1 },
      { title: 'Ủ thủ công truyền thống', subTitle: 'Giữ trọn hương vị cổ truyền', order: 2 },
      { title: 'An toàn cho sức khỏe', subTitle: 'Không hóa chất, không phụ gia', order: 3 },
      { title: 'Hương vị đặc trưng', subTitle: 'Êm, thơm, đậm đà', order: 4 },
      { title: 'Quà tặng ý nghĩa', subTitle: 'Cho người thân, đối tác', order: 5 },
    ]);
    console.log('✅ USP Features seeded');
  }

  // Intro
  const introExists = await Intro.findOne();
  if (!introExists) {
    await Intro.create({
      title: 'Tinh hoa Men Lá Việt',
      description:
        'Rượu Men Lá Yến Nhi là sự kết hợp hài hòa giữa bí quyết dân gian và nguồn nguyên liệu thiên nhiên, mang đến hương vị độc đáo, đậm đà bản sắc quê hương.',
      buttonText: 'TÌM HIỂU NGAY',
      buttonLink: '/gioi-thieu',
    });
    console.log('✅ Intro seeded');
  }

  // Products
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany([
      {
        name: 'Rượu Men Lá Truyền Thống',
        volume: '500ml',
        description: 'Rượu men lá truyền thống, hương vị đậm đà, nguyên liệu tự nhiên 100%.',
        price: 180000,
        isFeatured: true,
        isActive: true,
        order: 1,
        slug: 'ruou-men-la-truyen-thong',
      },
      {
        name: 'Rượu Men Lá Đặc Biệt',
        volume: '750ml',
        description: 'Phiên bản đặc biệt, ủ lâu hơn, hương vị tinh tế và phong phú hơn.',
        price: 280000,
        isFeatured: true,
        isActive: true,
        order: 2,
        slug: 'ruou-men-la-dac-biet',
      },
      {
        name: 'Rượu Men Lá Quà Tặng',
        volume: 'Hộp 2 chai',
        description: 'Hộp quà sang trọng gồm 2 chai, phù hợp làm quà biếu tặng dịp lễ, Tết.',
        price: 420000,
        isFeatured: true,
        isActive: true,
        order: 3,
        slug: 'ruou-men-la-qua-tang',
      },
    ]);
    console.log('✅ Products seeded');
  }

  // Process
  const processExists = await Process.findOne();
  if (!processExists) {
    await Process.create({
      sectionTitle: 'QUY TRÌNH SẢN XUẤT',
      sectionSubtitle: 'Giữ trọn hương vị tự nhiên',
      sectionDescription:
        'Rượu Men Lá Yến Nhi được làm từ gạo nếp chọn lọc, men lá rừng truyền thống, ủ thủ công theo bí quyết dân gian, đảm bảo hương vị thuần khiết và an toàn cho sức khỏe.',
      buttonText: 'XEM CHI TIẾT QUY TRÌNH',
      buttonLink: '/quy-trinh',
    });
  }

  const stepCount = await ProcessStep.countDocuments();
  if (stepCount === 0) {
    await ProcessStep.insertMany([
      { stepNumber: 1, title: 'Chọn nguyên liệu', subtitle: 'Gạo nếp, men lá rừng' },
      { stepNumber: 2, title: 'Làm men lá', subtitle: 'Theo bí quyết truyền thống' },
      { stepNumber: 3, title: 'Ủ rượu', subtitle: 'Trong chum sành tự nhiên' },
      { stepNumber: 4, title: 'Lọc và hoàn thiện', subtitle: 'Giữ trọn hương vị' },
    ]);
    console.log('✅ Process steps seeded');
  }

  // Brand Story
  const storyExists = await BrandStory.findOne();
  if (!storyExists) {
    await BrandStory.create({
      title: 'CÂU CHUYỆN THƯƠNG HIỆU',
      subTitle: 'Hương rượu từ núi rừng',
      description:
        'Hợp tác xã Dịch Vụ Thương mại Yến Nhi ra đời với mong muốn lưu giữ và phát huy giá trị rượu men lá truyền thống của quê hương, đưa hương vị đặc trưng của núi rừng đến gần hơn với mọi gia đình.',
      buttonText: 'VỀ CHÚNG TÔI',
      buttonLink: '/gioi-thieu',
    });
    console.log('✅ Brand Story seeded');
  }

  // Testimonials
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany([
      {
        comment: 'Rượu thơm, êm dễ uống, thích hợp làm quà biếu.',
        customerName: 'Anh Minh Tuấn',
        location: 'Hà Nội',
        rating: 5,
        order: 1,
      },
      {
        comment: 'Hương vị đúng chất rượu men lá truyền thống, rất đặc biệt.',
        customerName: 'Chị Thu Hương',
        location: 'Bắc Ninh',
        rating: 5,
        order: 2,
      },
      {
        comment: 'Sản phẩm chất lượng, bao bì đẹp, thích hợp làm quà tặng.',
        customerName: 'Anh Quốc Bảo',
        location: 'Hải Phòng',
        rating: 5,
        order: 3,
      },
    ]);
    console.log('✅ Testimonials seeded');
  }

  // Site Config
  const configExists = await SiteConfig.findOne();
  if (!configExists) {
    await SiteConfig.create({
      companyName: 'Hợp Tác Xã Dịch Vụ Thương Mại Yến Nhi',
      address: 'Thôn Tân Đồng, Xã Nam Dương, Thành Phố Bắc Ninh',
      phone1: '0372.477.078',
      email: 'yen.nhi.ruoumenla@gmail.com',
      metaTitle: 'Rượu Men Lá Yến Nhi - Hương vị truyền thống từ núi rừng',
    });
    console.log('✅ Site Config seeded');
  }

  console.log('🎉 Seed hoàn tất!');
};

module.exports = seed;

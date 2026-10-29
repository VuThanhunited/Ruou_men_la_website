const Admin = require('../models/Admin');
const {
  Hero,
  UspFeature,
  Intro,
  Product,
  Process,
  ProcessStep,
  BrandStory,
  News,
  Testimonial,
  SiteConfig,
} = require('../models/Content');

const seed = async () => {
  console.log('🌱 Bắt đầu kiểm tra & seed dữ liệu mẫu...');

  // Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ruoumenla.vn';
  const adminExists = await Admin.findOne({ email: adminEmail });
  if (!adminExists) {
    await Admin.create({
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      name: 'Admin Yến Nhi',
    });
    console.log('✅ Admin account created');
  }

  // Hero
  let hero = await Hero.findOne();
  if (!hero) {
    await Hero.create({
      logoUrl: '/assets/logo.jpg',
      heroBgUrl: '/assets/hero-bg.jpg',
      title: 'Rượu\nMen Lá',
      subtitle: 'Hương vị truyền thống từ núi rừng quê hương',
      description:
        'Rượu Men Lá Yến Nhi được ủ từ những nguyên liệu thiên nhiên, kết tinh hoa của núi rừng và bàn tay người dân tộc, mang đến hương vị đậm đà, mộc mạc, tốt cho sức khỏe.',
      ctaText: 'KHÁM PHÁ SẢN PHẨM',
      ctaLink: '#san-pham',
      hotline: '0372.477.078',
      sideBannerText: 'Rượu\nsạch từ\nthiên nhiên',
    });
    console.log('✅ Hero data seeded');
  } else {
    let changed = false;
    if (!hero.logoUrl) { hero.logoUrl = '/assets/logo.jpg'; changed = true; }
    if (!hero.heroBgUrl) { hero.heroBgUrl = '/assets/hero-bg.jpg'; changed = true; }
    if (changed) await hero.save();
  }

  // USP Features
  const defaultUspIcons = [
    '/assets/icons/usp-nature.svg',
    '/assets/icons/usp-craft.svg',
    '/assets/icons/usp-safety.svg',
    '/assets/icons/usp-flavor.svg',
    '/assets/icons/usp-gift.svg',
  ];
  const uspList = await UspFeature.find().sort('order');
  if (uspList.length === 0) {
    await UspFeature.insertMany([
      { iconUrl: defaultUspIcons[0], title: 'Nguyên liệu thiên nhiên', subTitle: 'Men lá rừng truyền thống', order: 1 },
      { iconUrl: defaultUspIcons[1], title: 'Ủ thủ công truyền thống', subTitle: 'Giữ trọn hương vị cổ truyền', order: 2 },
      { iconUrl: defaultUspIcons[2], title: 'An toàn cho sức khỏe', subTitle: 'Không hóa chất, không phụ gia', order: 3 },
      { iconUrl: defaultUspIcons[3], title: 'Hương vị đặc trưng', subTitle: 'Êm, thơm, đậm đà', order: 4 },
      { iconUrl: defaultUspIcons[4], title: 'Quà tặng ý nghĩa', subTitle: 'Cho người thân, đối tác', order: 5 },
    ]);
    console.log('✅ USP Features seeded');
  } else {
    for (let i = 0; i < uspList.length; i++) {
      if (!uspList[i].iconUrl && defaultUspIcons[i]) {
        uspList[i].iconUrl = defaultUspIcons[i];
        await uspList[i].save();
      }
    }
  }

  // Intro
  let intro = await Intro.findOne();
  if (!intro) {
    await Intro.create({
      introBannerUrl: '/assets/intro-bg.jpg',
      title: 'Tinh hoa\nMen Lá Việt',
      description:
        'Rượu Men Lá Yến Nhi là sự kết hợp hài hòa giữa bí quyết dân gian và nguồn nguyên liệu thiên nhiên, mang đến hương vị độc đáo, đậm đà bản sắc quê hương.',
      buttonText: 'TÌM HIỂU NGAY',
      buttonLink: '#gioi-thieu',
    });
    console.log('✅ Intro seeded');
  } else if (!intro.introBannerUrl) {
    intro.introBannerUrl = '/assets/intro-bg.jpg';
    await intro.save();
  }

  // Products
  const defaultProductImgs = ['/assets/product-1.jpg', '/assets/product-2.jpg', '/assets/product-3.jpg'];
  const products = await Product.find().sort('order');
  if (products.length === 0) {
    await Product.insertMany([
      {
        thumbnailUrl: '/assets/product-1.jpg',
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
        thumbnailUrl: '/assets/product-2.jpg',
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
        thumbnailUrl: '/assets/product-3.jpg',
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
  } else {
    for (let i = 0; i < products.length; i++) {
      if (!products[i].thumbnailUrl && defaultProductImgs[i]) {
        products[i].thumbnailUrl = defaultProductImgs[i];
        await products[i].save();
      }
    }
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
      buttonLink: '#quy-trinh',
    });
  }

  const defaultStepData = [
    {
      stepNumber: 1,
      imageUrl: '/assets/process-step-1.jpg',
      title: 'Chọn nguyên liệu',
      subtitle: 'Gạo nếp, men lá rừng',
      detailTitle: 'Tuyển Chọn Gạo Nếp & Thảo Dược Vùng Cao',
      lead: 'Rượu ngon phải bắt nguồn từ nguyên liệu sạch và tinh túy nhất của đất trời vùng cao.',
      details: [
        'Gạo nếp nương: Lựa chọn những hạt nếp nương mùa vụ mới của đồng bào miền núi phía Bắc, hạt tròn đều, mẩy căng, khi nấu lên dẻo quánh và dậy mùi thơm nồng nàn.',
        'Nguồn nước khoáng tự nhiên: Sử dụng nước nguồn thanh khiết từ các khe suối đá trên núi cao, giàu khoáng chất tự nhiên, giúp rượu có hậu vị ngọt thanh mát lành.',
        'Sơ chế kỹ lưỡng: Gạo được ngâm và vo sạch bằng nước suối trong, loại bỏ hoàn toàn hạt lép và tạp chất trước khi đưa vào chõ gỗ đồ chín.',
      ],
      secret: 'Chỉ sử dụng nếp nương gieo trồng tự nhiên trên nương rẫy, tuyệt đối không dùng gạo pha tạp chất hay chất kích thích.',
    },
    {
      stepNumber: 2,
      imageUrl: '/assets/process-step-2.jpg',
      title: 'Làm men lá',
      subtitle: 'Theo bí quyết truyền thống',
      detailTitle: 'Bí Quyết 20+ Vị Thảo Dược Men Lá Rừng',
      lead: 'Men lá không phải là men công nghiệp hay men hóa chất, mà là sự kết tinh của thảo dược rừng nguyên sinh.',
      details: [
        'Hơn 20 vị thảo dược quý: Người nghệ nhân phải trèo đèo lội suối vào rừng sâu ở độ cao hơn 1.000m để hái lá trầu rừng, hoàng đằng, quả ké đầu ngựa, trần bì, nhân trần, thảo quả...',
        'Chế biến công phu: Rửa sạch, phơi khô trong bóng râm (âm can) để giữ trọn tinh dầu, sau đó giã và nghiền mịn thành bột thuốc nam.',
        'Nặn bánh men thủ công: Bột thảo dược được nhào kỹ cùng bột gạo nếp, nặn thành từng bánh men tròn đều tay và ủ trong lớp rơm nếp khô sạch để men sinh sôi tự nhiên.',
      ],
      secret: 'Men lá giúp phân giải hoàn toàn các chất độc hại, làm rượu uống êm ru, ấm tỳ vị, lưu thông khí huyết và không bao giờ gây đau đầu hay khô cổ.',
    },
    {
      stepNumber: 3,
      imageUrl: '/assets/process-step-3.jpg',
      title: 'Ủ rượu',
      subtitle: 'Trong chum sành tự nhiên',
      detailTitle: 'Lên Men Tự Nhiên & Hạ Thổ Chum Sành',
      lead: 'Quá trình lên men và ủ đòi hỏi sự kiên nhẫn tuyệt đối, hòa cùng nhịp thở của tự nhiên.',
      details: [
        'Đồ cơm và trộn men: Cơm nếp nương sau khi đồ chín tới được trải đều ra nong tre cho nguội bớt, sau đó rắc đều bột men lá rừng theo tỷ lệ vàng gia truyền.',
        'Ủ khô và ủ ướt: Rượu trải qua quá trình lên men yếm khí tự nhiên trong điều kiện nhiệt độ phòng núi rừng mát mẻ quanh năm.',
        'Chum sành không tráng men: Chuyển toàn bộ bỗng rượu vào các chum gốm nung mộc tự nhiên giúp rượu thẩm thấu oxy và làm mềm giọt rượu.',
      ],
      secret: 'Rượu được hạ thổ hoặc ủ chum sành tối thiểu từ 6 đến 12 tháng, giúp đào thải triệt để độc tố Andehit và Methanol.',
    },
    {
      stepNumber: 4,
      imageUrl: '/assets/process-step-4.jpg',
      title: 'Lọc và hoàn thiện',
      subtitle: 'Giữ trọn hương vị',
      detailTitle: 'Chưng Cất Nồi Đồng & Kiểm Định Đóng Chai',
      lead: 'Chưng cất thủ công kết hợp cùng quy trình kiểm định chất lượng khắt khe để đảm bảo an toàn tuyệt đối.',
      details: [
        'Nồi đồng truyền thống: Sử dụng nồi đồng thủ công và đun bằng củi lửa nhỏ liu riu, giữ nhiệt ổn định để giọt rượu ngưng tụ từ từ.',
        'Hệ thống lọc tinh hiện đại: Rượu sau khi chưng cất được đưa qua hệ thống tháp lọc chuyên dụng để loại bỏ hoàn toàn cặn và tạp chất.',
        'Đóng chai & khử trùng: Đóng trong chai thủy tinh dày dặn hoặc nậm gốm đã qua khử trùng nhiệt độ cao, dán tem nhãn niêm phong chính hãng HTX Yến Nhi.',
      ],
      secret: 'Mỗi mẻ rượu xuất xưởng đều được đo nồng độ và kiểm nghiệm an toàn thực phẩm, đảm bảo chỉ số Methanol luôn ở mức an toàn.',
    },
  ];

  const steps = await ProcessStep.find().sort('stepNumber');
  if (steps.length === 0) {
    await ProcessStep.insertMany(defaultStepData);
    console.log('✅ Process steps seeded');
  } else {
    for (let i = 0; i < steps.length; i++) {
      const def = defaultStepData[i];
      if (def) {
        let changed = false;
        if (!steps[i].imageUrl) { steps[i].imageUrl = def.imageUrl; changed = true; }
        if (!steps[i].detailTitle) { steps[i].detailTitle = def.detailTitle; changed = true; }
        if (!steps[i].lead) { steps[i].lead = def.lead; changed = true; }
        if (!steps[i].details?.length) { steps[i].details = def.details; changed = true; }
        if (!steps[i].secret) { steps[i].secret = def.secret; changed = true; }
        if (changed) await steps[i].save();
      }
    }
  }

  // Brand Story
  let story = await BrandStory.findOne();
  if (!story) {
    await BrandStory.create({
      storyBgUrl: '/assets/brand-story-bg.jpg',
      title: 'CÂU CHUYỆN THƯƠNG HIỆU',
      subTitle: 'Hương rượu từ núi rừng',
      description:
        'Hợp tác xã Dịch Vụ Thương mại Yến Nhi ra đời với mong muốn lưu giữ và phát huy giá trị rượu men lá truyền thống của quê hương, đưa hương vị đặc trưng của núi rừng đến gần hơn với mọi gia đình.',
      buttonText: 'VỀ CHÚNG TÔI',
      buttonLink: '#gioi-thieu',
    });
    console.log('✅ Brand Story seeded');
  } else if (!story.storyBgUrl) {
    story.storyBgUrl = '/assets/brand-story-bg.jpg';
    await story.save();
  }

  // News
  const newsCount = await News.countDocuments();
  if (newsCount === 0) {
    await News.insertMany([
      {
        category: 'Văn Hóa Ẩm Thực',
        date: '24/10/2024',
        readTime: '4 phút đọc',
        title: 'Bí quyết tạo nên giọt rượu thơm từ hơn 20 loại thảo dược men lá rừng',
        excerpt:
          'Không đơn thuần là thức uống, rượu men lá là sự kết tinh kỳ công giữa thảo dược núi rừng tự nhiên, nếp nương dẻo thơm và kinh nghiệm gia truyền của đồng bào vùng cao.',
        imageUrl: '/assets/process-step-2.jpg',
        content: [
          'Để tạo nên một mẻ men lá chuẩn vị, người làm rượu phải lặn lội vào sâu trong những cánh rừng nguyên sinh ở độ cao trên 1.000 mét để tìm kiếm đủ hơn 20 vị lá, rễ cây thuốc quý như lá trầu rừng, quả ké đầu ngựa, rễ cây nhân trần, hoàng đằng, trần bì...',
          'Các loại thảo dược sau khi thu hái được rửa sạch bằng nước suối nguồn, băm nhỏ, phơi khô trong bóng râm và nghiền thành bột mịn. Sau đó, bột thuốc được nhào cùng bột gạo nếp nương, nặn thành từng bánh men tròn xinh xắn rồi ủ trong rơm khô tự nhiên.',
          'Chính nhờ sự kết hợp độc đáo của các vị thuốc nam này mà rượu men lá Yến Nhi khi uống có vị êm dịu, ngọt hậu, làm ấm tỳ vị, lưu thông khí huyết và tuyệt đối không gây đau đầu hay khô cổ.',
        ],
        quote: 'Mỗi bánh men là một bài thuốc dân gian được chắt lọc qua nhiều thế hệ đồng bào nơi rẻo cao.',
        order: 1,
        isActive: true,
      },
      {
        category: 'Tin Tức HTX',
        date: '15/10/2024',
        readTime: '3 phút đọc',
        title: 'Rượu Men Lá Yến Nhi: Hành trình đạt chuẩn OCOP và giữ gìn bản sắc quê hương',
        excerpt:
          'Từ quy mô truyền thống tại bản làng, HTX Yến Nhi đã chuẩn hóa quy trình sản xuất trong chum sành mộc tự nhiên để đưa giọt rượu quê hương vươn xa.',
        imageUrl: '/assets/brand-story-bg.jpg',
        content: [
          'Nhằm nâng tầm sản phẩm truyền thống của địa phương, Hợp Tác Xã Dịch Vụ Thương Mại Yến Nhi đã đầu tư xưởng sản xuất đạt tiêu chuẩn an toàn thực phẩm, đồng thời giữ nguyên phương pháp chưng cất thủ công truyền thống.',
          'Sản phẩm Rượu Men Lá Yến Nhi được kiểm nghiệm nghiêm ngặt về chỉ số Methanol, Andehit và các độc tố khác. Toàn bộ các mẻ rượu đều được ủ chum sành tự nhiên tối thiểu từ 6 đến 12 tháng trước khi xuất xưởng.',
          'Việc định hướng tham gia chương trình OCOP (Mỗi xã một sản phẩm) không chỉ khẳng định uy tín chất lượng của Yến Nhi mà còn tạo sinh kế bền vững cho bà con đồng bào thu hái dược liệu tại địa phương.',
        ],
        quote: 'Giữ gìn bản sắc không có nghĩa là khép kín, mà là đem tinh hoa truyền thống phục vụ đời sống hiện đại.',
        order: 2,
        isActive: true,
      },
      {
        category: 'Cẩm Nang Thưởng Rượu',
        date: '05/10/2024',
        readTime: '3 phút đọc',
        title: 'Nghệ thuật thưởng thức rượu men lá: Uống đúng điệu để trọn vị và tốt cho sức khỏe',
        excerpt:
          'Khác biệt với các dòng rượu thông thường, rượu men lá mang hương thơm phảng phất của núi rừng, vị êm dịu và cảm giác khoan khoái, ấm áp khi thưởng thức.',
        imageUrl: '/assets/intro-bg.jpg',
        content: [
          'Để cảm nhận trọn vẹn hương vị tinh túy của rượu men lá, người sành rượu thường rót rượu vào chén gốm hoặc chén mắt trâu mộc mạc. Rượu men lá ngon khi rót ra sẽ sủi tăm nhỏ li ti, trong vắt như nước suối đầu nguồn.',
          'Khi thưởng thức, hãy đưa chén rượu lên ngang mũi để hít hà hương thơm nồng ấm của nếp nương và thảo mộc. Sau đó nhấp từng ngụm nhỏ, để giọt rượu từ từ thấm đượm nơi đầu lưỡi và cảm nhận vị ngọt hậu sâu lắng nơi cuống họng.',
          'Rượu men lá rất thích hợp khi kết hợp cùng các món ăn đặc sản vùng cao như thịt trâu gác bếp, lợn bản nướng, gà đồi hấp hay cá suối nướng. Uống điều độ mỗi bữa 1-2 chén nhỏ còn giúp kích thích tiêu hóa và ngủ ngon giấc.',
        ],
        quote: 'Uống rượu men lá là thưởng thức văn hóa và cái tình mộc mạc, hiếu khách của người miền sơn cước.',
        order: 3,
        isActive: true,
      },
    ]);
    console.log('✅ News articles seeded');
  }

  // Testimonials
  const defaultAvatars = ['/assets/avatar-1.jpg', '/assets/avatar-2.jpg', '/assets/avatar-3.jpg'];
  const testimonials = await Testimonial.find().sort('order');
  if (testimonials.length === 0) {
    await Testimonial.insertMany([
      {
        avatarUrl: '/assets/avatar-1.jpg',
        comment: 'Rượu thơm, êm dễ uống, thích hợp làm quà biếu.',
        customerName: 'Anh Minh Tuấn',
        location: 'Hà Nội',
        rating: 5,
        order: 1,
      },
      {
        avatarUrl: '/assets/avatar-2.jpg',
        comment: 'Hương vị đúng chất rượu men lá truyền thống, rất đặc biệt.',
        customerName: 'Chị Thu Hương',
        location: 'Bắc Ninh',
        rating: 5,
        order: 2,
      },
      {
        avatarUrl: '/assets/avatar-3.jpg',
        comment: 'Sản phẩm chất lượng, bao bì đẹp, thích hợp làm quà tặng.',
        customerName: 'Anh Quốc Bảo',
        location: 'Hải Phòng',
        rating: 5,
        order: 3,
      },
    ]);
    console.log('✅ Testimonials seeded');
  } else {
    for (let i = 0; i < testimonials.length; i++) {
      if (!testimonials[i].avatarUrl && defaultAvatars[i]) {
        testimonials[i].avatarUrl = defaultAvatars[i];
        await testimonials[i].save();
      }
    }
  }

  // Site Config
  let config = await SiteConfig.findOne();
  if (!config) {
    await SiteConfig.create({
      footerLogoUrl: '/assets/logo.jpg',
      companyName: 'Hợp Tác Xã Dịch Vụ Thương Mại Yến Nhi',
      address: 'Thôn Tân Đồng, Xã Nam Dương, Thành Phố Bắc Ninh',
      phone1: '0372.477.078',
      email: 'yen.nhi.ruoumenla@gmail.com',
      metaTitle: 'Rượu Men Lá Yến Nhi - Hương vị truyền thống từ núi rừng',
    });
    console.log('✅ Site Config seeded');
  } else if (!config.footerLogoUrl) {
    config.footerLogoUrl = '/assets/logo.jpg';
    await config.save();
  }

  console.log('🎉 Seed hoàn tất!');
};

module.exports = seed;

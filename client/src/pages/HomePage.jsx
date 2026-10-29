import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import UspBar from '../components/UspBar';
import SplitSection from '../components/SplitSection';
import ProcessSection from '../components/ProcessSection';
import BrandStorySection from '../components/BrandStorySection';
import NewsSection, { DEFAULT_ARTICLES } from '../components/NewsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CompanyModal from '../components/CompanyModal';
import NewsModal from '../components/NewsModal';
import ProductDetailModal from '../components/ProductDetailModal';
import ProcessModal from '../components/ProcessModal';
import OrderModal from '../components/OrderModal';
import Footer from '../components/Footer';

// ============================================================
// STATIC DEFAULT DATA — hiển thị ngay khi API chưa có dữ liệu
// ============================================================
const LOGO = '/assets/logo.jpg';

const DEFAULT_HERO = {
  title: 'Rượu\nMen Lá',
  subtitle: 'Hương vị truyền thống từ núi rừng quê hương',
  description: 'Rượu Men Lá Yến Nhi được ủ từ những nguyên liệu thiên nhiên, kết tinh hoa của núi rừng và bàn tay người dân tộc, mang đến hương vị đậm đà, mộc mạc, tốt cho sức khỏe.',
  ctaText: 'KHÁM PHÁ SẢN PHẨM',
  ctaLink: '#san-pham',
  hotline: '0372.477.078',
  logoUrl: LOGO,
  heroBgUrl: '/assets/hero-bg.jpg',
  heroProductUrl: null, // Ảnh chum và biển gỗ đã có sẵn trong hero-bg.jpg
  sideBannerText: 'Rượu\nsạch từ\nthiên nhiên',
};

const DEFAULT_USP = [
  { _id: '1', icon: '/assets/icons/usp-nature.svg', title: 'NGUYÊN LIỆU\nTHIÊN NHIÊN', subtitle: 'Men lá rừng truyền thống' },
  { _id: '2', icon: '/assets/icons/usp-craft.svg', title: 'Ủ THỦ CÔNG\nTRUYỀN THỐNG', subtitle: 'Giữ trọn hương vị cổ truyền' },
  { _id: '3', icon: '/assets/icons/usp-safety.svg', title: 'AN TOÀN\nCHO SỨC KHỎE', subtitle: 'Không hóa chất, không phụ gia' },
  { _id: '4', icon: '/assets/icons/usp-flavor.svg', title: 'HƯƠNG VỊ\nĐẶC TRƯNG', subtitle: 'Êm, thơm, đậm đà' },
  { _id: '5', icon: '/assets/icons/usp-gift.svg', title: 'QUÀ TẶNG\nÝ NGHĨA', subtitle: 'Cho người thân, đối tác' },
];

const DEFAULT_INTRO = {
  title: 'Tinh hoa\nMen Lá Việt',
  description: 'Rượu Men Lá Yến Nhi là sự kết hợp hài hòa giữa bí quyết dân gian và nguồn nguyên liệu thiên nhiên, mang đến hương vị độc đáo, đậm đà bản sắc quê hương.',
  buttonText: 'TÌM HIỂU NGAY',
  buttonLink: '#gioi-thieu',
  introBgUrl: '/assets/intro-bg.jpg',
};

const DEFAULT_PRODUCTS = [
  { _id: '1', name: 'Rượu Men Lá\nTruyền Thống', volume: '500ml', price: 180000, thumbnailUrl: '/assets/product-1.jpg' },
  { _id: '2', name: 'Rượu Men Lá\nĐặc Biệt', volume: '750ml', price: 250000, thumbnailUrl: '/assets/product-2.jpg' },
  { _id: '3', name: 'Rượu Men Lá\nQuà Tặng', volume: 'Hộp 2 chai', price: 350000, thumbnailUrl: '/assets/product-3.jpg' },
];

const DEFAULT_PROCESS_SECTION = {
  sectionTitle: 'QUY TRÌNH SẢN XUẤT',
  sectionSubtitle: 'Giữ trọn hương vị tự nhiên',
  sectionDescription: 'Rượu Men Lá Yến Nhi được làm từ gạo nếp chọn lọc, men lá rừng truyền thống, ủ thủ công theo bí quyết dân gian, đảm bảo hương vị thuần khiết và an toàn cho sức khỏe.',
  buttonText: 'XEM CHI TIẾT QUY TRÌNH',
  buttonLink: '#quy-trinh',
};

const DEFAULT_STEPS = [
  { _id: '1', stepNumber: 1, title: 'Chọn nguyên liệu', subtitle: 'Gạo nếp, men lá rừng', imageUrl: '/assets/process-step-1.jpg' },
  { _id: '2', stepNumber: 2, title: 'Làm men lá', subtitle: 'Theo bí quyết truyền thống', imageUrl: '/assets/process-step-2.jpg' },
  { _id: '3', stepNumber: 3, title: 'Ủ rượu', subtitle: 'Trong chum sành tự nhiên', imageUrl: '/assets/process-step-3.jpg' },
  { _id: '4', stepNumber: 4, title: 'Lọc và hoàn thiện', subtitle: 'Giữ trọn hương vị', imageUrl: '/assets/process-step-4.jpg' },
];

const DEFAULT_BRAND_STORY = {
  title: 'CÂU CHUYỆN THƯƠNG HIỆU',
  subTitle: 'Hương rượu từ núi rừng',
  description: 'Hợp tác xã Dịch Vụ Thương mại Yến Nhi ra đời với mong muốn lưu giữ và phát huy giá trị rượu men lá truyền thống của quê hương, đưa hương vị đặc trưng của núi rừng đến gần hơn với mọi gia đình.',
  buttonText: 'VỀ CHÚNG TÔI',
  buttonLink: '#gioi-thieu',
  storyBgUrl: '/assets/brand-story-bg.jpg',
};

const DEFAULT_TESTIMONIALS = [
  {
    _id: '1',
    comment: 'Rượu thơm, êm, dễ uống. Rất thích hợp làm quà biếu.',
    customerName: 'Anh Minh Tuấn',
    location: 'Hà Nội',
    rating: 5,
    avatarUrl: '/assets/avatar-1.jpg',
  },
  {
    _id: '2',
    comment: 'Hương vị đúng chất rượu men lá truyền thống, rất đặc biệt.',
    customerName: 'Chị Thu Hương',
    location: 'Bắc Ninh',
    rating: 5,
    avatarUrl: '/assets/avatar-2.jpg',
  },
  {
    _id: '3',
    comment: 'Sản phẩm chất lượng, bao bì đẹp, thích hợp làm quà tặng.',
    customerName: 'Anh Quốc Bảo',
    location: 'Hải Phòng',
    rating: 5,
    avatarUrl: '/assets/avatar-3.jpg',
  },
];

const DEFAULT_CONFIG = {
  companyName: 'Hợp Tác Xã Dịch Vụ Thương Mại Yến Nhi',
  address: 'Thôn Tân Đồng, Xã Nam Dương, Thành Phố Bắc Ninh',
  phone1: '0372.477.078',
  email: 'yen.nhi.ruoumenla@gmail.com',
  facebookUrl: '#',
  logoUrl: LOGO,
};

export default function HomePage() {
  const [data, setData] = useState({
    hero: DEFAULT_HERO,
    usp: DEFAULT_USP,
    intro: DEFAULT_INTRO,
    products: DEFAULT_PRODUCTS,
    process: DEFAULT_PROCESS_SECTION,
    steps: DEFAULT_STEPS,
    brandStory: DEFAULT_BRAND_STORY,
    news: DEFAULT_ARTICLES,
    testimonials: DEFAULT_TESTIMONIALS,
    config: DEFAULT_CONFIG,
  });

  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [processModalState, setProcessModalState] = useState({ isOpen: false, step: 1 });
  const [orderItem, setOrderItem] = useState(null);

  // Fetch từ API — nếu thành công thì override static data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [hero, usp, intro, products, processData, brandStory, testimonials, config] =
          await Promise.allSettled([
            api.get('/hero'),
            api.get('/usp'),
            api.get('/intro'),
            api.get('/products?featured=true'),
            api.get('/process'),
            api.get('/brand-story'),
            api.get('/testimonials'),
            api.get('/site-config'),
          ]);

        setData((prev) => ({
          hero: hero.status === 'fulfilled' && hero.value.data.data ? { ...prev.hero, ...hero.value.data.data } : prev.hero,
          usp: usp.status === 'fulfilled' && usp.value.data.data?.length ? usp.value.data.data : prev.usp,
          intro: intro.status === 'fulfilled' && intro.value.data.data ? intro.value.data.data : prev.intro,
          products: products.status === 'fulfilled' && products.value.data.data?.length ? products.value.data.data : prev.products,
          process: processData.status === 'fulfilled' ? processData.value.data.data?.section || prev.process : prev.process,
          steps: processData.status === 'fulfilled' && processData.value.data.data?.steps?.length ? processData.value.data.data.steps : prev.steps,
          brandStory: brandStory.status === 'fulfilled' && brandStory.value.data.data ? brandStory.value.data.data : prev.brandStory,
          news: prev.news,
          testimonials: testimonials.status === 'fulfilled' && testimonials.value.data.data?.length ? testimonials.value.data.data : prev.testimonials,
          config: config.status === 'fulfilled' && config.value.data.data ? config.value.data.data : prev.config,
        }));

        if (config.status === 'fulfilled' && config.value.data.data?.metaTitle) {
          document.title = config.value.data.data.metaTitle;
        }
      } catch (err) {
        console.warn('API chưa kết nối, dùng dữ liệu mặc định:', err.message);
      }
    };
    fetchAll();
  }, []);

  return (
    <>
      <Navbar hotline={data.hero?.hotline || data.config?.phone1} />

      <main>
        <HeroSection data={data.hero} />
        <UspBar features={data.usp} />
        <SplitSection
          intro={data.intro}
          products={data.products}
          onOpenAbout={() => setCompanyModalOpen(true)}
          onSelectProduct={(product) => setSelectedProduct(product)}
        />
        <ProcessSection
          section={data.process}
          steps={data.steps}
          onOpenProcessModal={(stepNum) => setProcessModalState({ isOpen: true, step: stepNum || 1 })}
        />
        <BrandStorySection
          data={data.brandStory}
          onOpenCompanyModal={() => setCompanyModalOpen(true)}
        />
        <NewsSection
          articles={data.news}
          onSelectArticle={(article) => setSelectedArticle(article)}
        />
        <TestimonialsSection testimonials={data.testimonials} />
      </main>

      <Footer config={data.config} />

      {/* Popups */}
      <CompanyModal
        isOpen={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        config={data.config}
      />

      <NewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onOrderNow={(productWithQty) => {
          setSelectedProduct(null);
          setOrderItem(productWithQty);
        }}
        hotline={data.hero?.hotline || data.config?.phone1}
      />

      <ProcessModal
        isOpen={processModalState.isOpen}
        initialStep={processModalState.step}
        onClose={() => setProcessModalState({ isOpen: false, step: 1 })}
        hotline={data.hero?.hotline || data.config?.phone1}
      />

      <OrderModal
        orderItem={orderItem}
        isOpen={Boolean(orderItem)}
        onClose={() => setOrderItem(null)}
        hotline={data.hero?.hotline || data.config?.phone1}
      />
    </>
  );
}

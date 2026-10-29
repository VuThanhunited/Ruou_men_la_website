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

const LOGO = '/assets/logo.jpg';

const DEFAULT_HERO = {
  title: 'Rượu\nMen Lá',
  subtitle: 'Hương vị truyền thống từ núi rừng quê hương',
  description:
    'Rượu Men Lá Yến Nhi được ủ từ những nguyên liệu thiên nhiên, kết tinh hoa của núi rừng và bàn tay người dân tộc, mang đến hương vị đậm đà, mộc mạc, tốt cho sức khỏe.',
  ctaText: 'KHÁM PHÁ SẢN PHẨM',
  ctaLink: '#san-pham',
  hotline: '0372.477.078',
  logoUrl: LOGO,
  heroBgUrl: '/assets/hero-bg.jpg',
  heroProductUrl: null,
  sideBannerText: 'Rượu\nsạch từ\nthiên nhiên',
  sideBannerBgUrl: '',
};

const DEFAULT_USP = [
  { _id: '1', iconUrl: '/assets/icons/usp-nature.svg', title: 'NGUYÊN LIỆU\nTHIÊN NHIÊN', subTitle: 'Men lá rừng truyền thống' },
  { _id: '2', iconUrl: '/assets/icons/usp-craft.svg', title: 'Ủ THỦ CÔNG\nTRUYỀN THỐNG', subTitle: 'Giữ trọn hương vị cổ truyền' },
  { _id: '3', iconUrl: '/assets/icons/usp-safety.svg', title: 'AN TOÀN\nCHO SỨC KHỎE', subTitle: 'Không hóa chất, không phụ gia' },
  { _id: '4', iconUrl: '/assets/icons/usp-flavor.svg', title: 'HƯƠNG VỊ\nĐẶC TRƯNG', subTitle: 'Êm, thơm, đậm đà' },
  { _id: '5', iconUrl: '/assets/icons/usp-gift.svg', title: 'QUÀ TẶNG\nÝ NGHĨA', subTitle: 'Cho người thân, đối tác' },
];

const DEFAULT_INTRO = {
  title: 'Tinh hoa\nMen Lá Việt',
  description:
    'Rượu Men Lá Yến Nhi là sự kết hợp hài hòa giữa bí quyết dân gian và nguồn nguyên liệu thiên nhiên, mang đến hương vị độc đáo, đậm đà bản sắc quê hương.',
  buttonText: 'TÌM HIỂU NGAY',
  buttonLink: '#gioi-thieu',
  introBannerUrl: '/assets/intro-bg.jpg',
};

const DEFAULT_PRODUCTS = [
  { _id: '1', name: 'Rượu Men Lá\nTruyền Thống', volume: '500ml', price: 180000, thumbnailUrl: '/assets/product-1.jpg' },
  { _id: '2', name: 'Rượu Men Lá\nĐặc Biệt', volume: '750ml', price: 280000, thumbnailUrl: '/assets/product-2.jpg' },
  { _id: '3', name: 'Rượu Men Lá\nQuà Tặng', volume: 'Hộp 2 chai', price: 420000, thumbnailUrl: '/assets/product-3.jpg' },
];

const DEFAULT_PROCESS_SECTION = {
  sectionTitle: 'QUY TRÌNH SẢN XUẤT',
  sectionSubtitle: 'Giữ trọn hương vị tự nhiên',
  sectionDescription:
    'Rượu Men Lá Yến Nhi được làm từ gạo nếp chọn lọc, men lá rừng truyền thống, ủ thủ công theo bí quyết dân gian, đảm bảo hương vị thuần khiết và an toàn cho sức khỏe.',
  buttonText: 'XEM CHI TIẾT QUY TRÌNH',
  buttonLink: '#quy-trinh',
  decorBgUrl: '',
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
  description:
    'Hợp tác xã Dịch Vụ Thương mại Yến Nhi ra đời với mong muốn lưu giữ và phát huy giá trị rượu men lá truyền thống của quê hương, đưa hương vị đặc trưng của núi rừng đến gần hơn với mọi gia đình.',
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
  footerLogoUrl: LOGO,
  theme: {
    primaryColor: '#1C3319',
    primaryDarkColor: '#122210',
    primaryLightColor: '#2D5229',
    accentGoldColor: '#C59B5F',
    accentBrownColor: '#8C5A2B',
    bgColor: '#F4EFE6',
    bgAltColor: '#FAF6F0',
    textDarkColor: '#1E271D',
    textLightColor: '#F5EFE0',
    fontScript: "'Dancing Script', cursive",
    fontSerif: "'Lora', 'Playfair Display', Georgia, serif",
    fontSans: "'Be Vietnam Pro', 'Montserrat', sans-serif",
    heroOverlayOpacity: 85,
    storyOverlayOpacity: 88,
    showUsp: true,
    showIntro: true,
    showProducts: true,
    showProcess: true,
    showBrandStory: true,
    showNews: true,
    showTestimonials: true,
    sectionOrder: ['usp', 'split', 'process', 'brandStory', 'news', 'testimonials'],
  },
};

// Merge object nhưng giữ giá trị mặc định nếu trường từ API bị rỗng
const mergeWithDefault = (def, incoming) => {
  if (!incoming) return def;
  const result = { ...def, ...incoming };
  Object.keys(def).forEach((k) => {
    if ((incoming[k] === '' || incoming[k] === null || incoming[k] === undefined) && def[k]) {
      result[k] = def[k];
    }
  });
  return result;
};

// Áp dụng CSS Variables cho giao diện từ cấu hình Theme của Admin
const applyThemeToDOM = (theme) => {
  if (!theme) return;
  const root = document.documentElement;
  if (theme.primaryColor) root.style.setProperty('--color-primary', theme.primaryColor);
  if (theme.primaryDarkColor) root.style.setProperty('--color-primary-dark', theme.primaryDarkColor);
  if (theme.primaryLightColor) root.style.setProperty('--color-primary-light', theme.primaryLightColor);
  if (theme.accentGoldColor) root.style.setProperty('--color-accent-gold', theme.accentGoldColor);
  if (theme.accentBrownColor) root.style.setProperty('--color-accent-brown', theme.accentBrownColor);
  if (theme.bgColor) root.style.setProperty('--color-bg', theme.bgColor);
  if (theme.bgAltColor) root.style.setProperty('--color-bg-alt', theme.bgAltColor);
  if (theme.textDarkColor) root.style.setProperty('--color-text-dark', theme.textDarkColor);
  if (theme.textLightColor) root.style.setProperty('--color-text-light', theme.textLightColor);
  if (theme.fontScript) root.style.setProperty('--font-script', theme.fontScript);
  if (theme.fontSerif) root.style.setProperty('--font-serif', theme.fontSerif);
  if (theme.fontSans) root.style.setProperty('--font-sans', theme.fontSans);
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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [hero, usp, intro, products, processData, brandStory, news, testimonials, config] =
          await Promise.allSettled([
            api.get('/hero'),
            api.get('/usp'),
            api.get('/intro'),
            api.get('/products'),
            api.get('/process'),
            api.get('/brand-story'),
            api.get('/news'),
            api.get('/testimonials'),
            api.get('/site-config'),
          ]);

        const configData =
          config.status === 'fulfilled' && config.value.data.data
            ? mergeWithDefault(DEFAULT_CONFIG, config.value.data.data)
            : DEFAULT_CONFIG;

        if (configData.theme) {
          applyThemeToDOM(configData.theme);
        }

        setData((prev) => ({
          hero:
            hero.status === 'fulfilled' && hero.value.data.data
              ? mergeWithDefault(prev.hero, hero.value.data.data)
              : prev.hero,
          usp:
            usp.status === 'fulfilled' && usp.value.data.data?.length
              ? usp.value.data.data.map((u, i) => ({
                  ...u,
                  iconUrl: u.iconUrl || DEFAULT_USP[i]?.iconUrl || '/assets/icons/usp-nature.svg',
                }))
              : prev.usp,
          intro:
            intro.status === 'fulfilled' && intro.value.data.data
              ? mergeWithDefault(prev.intro, intro.value.data.data)
              : prev.intro,
          products:
            products.status === 'fulfilled' && products.value.data.data?.length
              ? products.value.data.data.map((p, i) => ({
                  ...p,
                  thumbnailUrl: p.thumbnailUrl || DEFAULT_PRODUCTS[i]?.thumbnailUrl || '/assets/product-1.jpg',
                }))
              : prev.products,
          process:
            processData.status === 'fulfilled' && processData.value.data.data?.section
              ? mergeWithDefault(prev.process, processData.value.data.data.section)
              : prev.process,
          steps:
            processData.status === 'fulfilled' && processData.value.data.data?.steps?.length
              ? processData.value.data.data.steps.map((s, i) => ({
                  ...s,
                  imageUrl: s.imageUrl || DEFAULT_STEPS[i]?.imageUrl || `/assets/process-step-${(i % 4) + 1}.jpg`,
                }))
              : prev.steps,
          brandStory:
            brandStory.status === 'fulfilled' && brandStory.value.data.data
              ? mergeWithDefault(prev.brandStory, brandStory.value.data.data)
              : prev.brandStory,
          news:
            news.status === 'fulfilled' && news.value.data.data?.length
              ? news.value.data.data
              : prev.news,
          testimonials:
            testimonials.status === 'fulfilled' && testimonials.value.data.data?.length
              ? testimonials.value.data.data.map((t, i) => ({
                  ...t,
                  avatarUrl: t.avatarUrl || DEFAULT_TESTIMONIALS[i]?.avatarUrl || '',
                }))
              : prev.testimonials,
          config: configData,
        }));

        if (configData.metaTitle) {
          document.title = configData.metaTitle;
        }
      } catch (err) {
        console.warn('API chưa kết nối, dùng dữ liệu mặc định:', err.message);
      }
    };
    fetchAll();
  }, []);

  const theme = data.config?.theme || DEFAULT_CONFIG.theme;
  const brandLogo = data.hero?.logoUrl || data.config?.footerLogoUrl || LOGO;
  const hotline = data.hero?.hotline || data.config?.phone1;
  const sectionOrder = theme?.sectionOrder?.length
    ? theme.sectionOrder
    : ['usp', 'split', 'process', 'brandStory', 'news', 'testimonials'];

  const renderSection = (key) => {
    switch (key) {
      case 'usp':
        return theme.showUsp !== false ? <UspBar key="usp" features={data.usp} /> : null;
      case 'split':
        return theme.showProducts !== false ? (
          <SplitSection
            key="split"
            intro={data.intro}
            products={data.products}
            showIntro={theme.showIntro !== false}
            onOpenAbout={() => setCompanyModalOpen(true)}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        ) : null;
      case 'process':
        return theme.showProcess !== false ? (
          <ProcessSection
            key="process"
            section={data.process}
            steps={data.steps}
            onOpenProcessModal={(stepNum) =>
              setProcessModalState({ isOpen: true, step: stepNum || 1 })
            }
          />
        ) : null;
      case 'brandStory':
        return theme.showBrandStory !== false ? (
          <BrandStorySection
            key="brandStory"
            data={data.brandStory}
            overlayOpacity={theme.storyOverlayOpacity ?? 88}
            onOpenCompanyModal={() => setCompanyModalOpen(true)}
          />
        ) : null;
      case 'news':
        return theme.showNews !== false ? (
          <NewsSection
            key="news"
            articles={data.news}
            onSelectArticle={(article) => setSelectedArticle(article)}
          />
        ) : null;
      case 'testimonials':
        return theme.showTestimonials !== false ? (
          <TestimonialsSection key="testimonials" testimonials={data.testimonials} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar hotline={hotline} logoUrl={brandLogo} />

      <main>
        <HeroSection
          data={data.hero}
          overlayOpacity={theme.heroOverlayOpacity ?? 85}
        />
        {sectionOrder.map((secKey) => renderSection(secKey))}
      </main>

      <Footer config={data.config} logoUrl={data.config?.footerLogoUrl || brandLogo} />

      {/* Popups */}
      <CompanyModal
        isOpen={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        config={data.config}
        logoUrl={brandLogo}
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
        hotline={hotline}
      />

      <ProcessModal
        isOpen={processModalState.isOpen}
        initialStep={processModalState.step}
        steps={data.steps}
        onClose={() => setProcessModalState({ isOpen: false, step: 1 })}
        hotline={hotline}
      />

      <OrderModal
        orderItem={orderItem}
        isOpen={Boolean(orderItem)}
        onClose={() => setOrderItem(null)}
        hotline={hotline}
      />
    </>
  );
}

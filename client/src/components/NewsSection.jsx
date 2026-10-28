import React from 'react';
import { FiCalendar, FiArrowRight, FiClock } from 'react-icons/fi';
import '../styles/News.css';

export const DEFAULT_ARTICLES = [
  {
    _id: '1',
    category: 'Văn Hóa Ẩm Thực',
    date: '24/10/2024',
    readTime: '4 phút đọc',
    title: 'Bí quyết tạo nên giọt rượu thơm từ hơn 20 loại thảo dược men lá rừng',
    excerpt: 'Không đơn thuần là thức uống, rượu men lá là sự kết tinh kỳ công giữa thảo dược núi rừng tự nhiên, nếp nương dẻo thơm và kinh nghiệm gia truyền của đồng bào vùng cao.',
    imageUrl: '/assets/process-step-2.jpg',
    content: [
      'Để tạo nên một mẻ men lá chuẩn vị, người làm rượu phải lặn lội vào sâu trong những cánh rừng nguyên sinh ở độ cao trên 1.000 mét để tìm kiếm đủ hơn 20 vị lá, rễ cây thuốc quý như lá trầu rừng, quả ké đầu ngựa, rễ cây nhân trần, hoàng đằng, trần bì...',
      'Các loại thảo dược sau khi thu hái được rửa sạch bằng nước suối nguồn, băm nhỏ, phơi khô trong bóng râm và nghiền thành bột mịn. Sau đó, bột thuốc được nhào cùng bột gạo nếp nương, nặn thành từng bánh men tròn xinh xắn rồi ủ trong rơm khô tự nhiên.',
      'Chính nhờ sự kết hợp độc đáo của các vị thuốc nam này mà rượu men lá Yến Nhi khi uống có vị êm dịu, ngọt hậu, làm ấm tỳ vị, lưu thông khí huyết và tuyệt đối không gây đau đầu hay khô cổ.',
    ],
    quote: 'Mỗi bánh men là một bài thuốc dân gian được chắt lọc qua nhiều thế hệ đồng bào nơi rẻo cao.',
  },
  {
    _id: '2',
    category: 'Tin Tức HTX',
    date: '15/10/2024',
    readTime: '3 phút đọc',
    title: 'Rượu Men Lá Yến Nhi: Hành trình đạt chuẩn OCOP và giữ gìn bản sắc quê hương',
    excerpt: 'Từ quy mô truyền thống tại bản làng Sơn Vĩ, HTX Yến Nhi đã chuẩn hóa quy trình sản xuất trong chum sành mộc tự nhiên để đưa giọt rượu quê hương vươn xa.',
    imageUrl: '/assets/brand-story-bg.jpg',
    content: [
      'Nhằm nâng tầm sản phẩm truyền thống của địa phương, Hợp Tác Xã Dịch Vụ Thương Mại Yến Nhi đã đầu tư xưởng sản xuất đạt tiêu chuẩn an toàn thực phẩm, đồng thời giữ nguyên phương pháp chưng cất thủ công truyền thống.',
      'Sản phẩm Rượu Men Lá Yến Nhi được kiểm nghiệm nghiêm ngặt về chỉ số Methanol, Andehit và các độc tố khác. Toàn bộ các mẻ rượu đều được ủ chum sành tự nhiên tối thiểu từ 6 đến 12 tháng trước khi xuất xưởng.',
      'Việc định hướng tham gia chương trình OCOP (Mỗi xã một sản phẩm) không chỉ khẳng định uy tín chất lượng của Yến Nhi mà còn tạo sinh kế bền vững cho bà con đồng bào thu hái dược liệu tại địa phương.',
    ],
    quote: 'Giữ gìn bản sắc không có nghĩa là khép kín, mà là đem tinh hoa truyền thống phục vụ đời sống hiện đại.',
  },
  {
    _id: '3',
    category: 'Cẩm Nang Thưởng Rượu',
    date: '05/10/2024',
    readTime: '3 phút đọc',
    title: 'Nghệ thuật thưởng thức rượu men lá: Uống đúng điệu để trọn vị và tốt cho sức khỏe',
    excerpt: 'Khác biệt với các dòng rượu thông thường, rượu men lá mang hương thơm phảng phất của núi rừng, vị êm dịu và cảm giác khoan khoái, ấm áp khi thưởng thức.',
    imageUrl: '/assets/intro-bg.jpg',
    content: [
      'Để cảm nhận trọn vẹn hương vị tinh túy của rượu men lá, người sành rượu thường rót rượu vào chén gốm hoặc chén mắt trâu mộc mạc. Rượu men lá ngon khi rót ra sẽ sủi tăm tăm nhỏ li ti, trong vắt như nước suối đầu nguồn.',
      'Khi thưởng thức, hãy đưa chén rượu lên ngang mũi để hít hà hương thơm nồng ấm của nếp nương và thảo mộc. Sau đó nhấp từng ngụm nhỏ, để giọt rượu từ từ thấm đượm nơi đầu lưỡi và cảm nhận vị ngọt hậu sâu lắng nơi cuống họng.',
      'Rượu men lá rất thích hợp khi kết hợp cùng các món ăn đặc sản vùng cao như thịt trâu gác bếp, lợn bản nướng, gà đồi hấp hay cá suối nướng. Uống điều độ mỗi bữa 1-2 chén nhỏ còn giúp kích thích tiêu hóa và ngủ ngon giấc.',
    ],
    quote: 'Uống rượu men lá là thưởng thức văn hóa và cái tình mộc mạc, hiếu khách của người miền sơn cước.',
  },
];

export default function NewsSection({ articles = DEFAULT_ARTICLES, onSelectArticle }) {
  const displayArticles = articles?.length ? articles : DEFAULT_ARTICLES;

  return (
    <section className="news-section" id="tin-tuc">
      <div className="container">
        {/* Header Section */}
        <div className="news-header">
          <div className="news-header-flourish">
            <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
              <path d="M14 9C10.5 3 3.5 1 1.5 7C-0.5 13 6.5 15 14 9Z" fill="#3A6332" opacity="0.85" />
              <path d="M14 9C17.5 3 24.5 1 26.5 7C28.5 13 21.5 15 14 9Z" fill="#3A6332" opacity="0.85" />
              <circle cx="14" cy="9" r="1.5" fill="#C59B5F" />
            </svg>
          </div>
          <h2 className="section-title news-title">
            TIN TỨC &amp; VĂN HÓA MEN LÁ
          </h2>
          <p className="news-subtitle">
            Cập nhật hoạt động mới nhất của HTX Yến Nhi và cẩm nang văn hóa ẩm thực truyền thống
          </p>
        </div>

        {/* 3 News Cards Grid */}
        <div className="news-grid">
          {displayArticles.slice(0, 3).map((item) => (
            <article
              key={item._id}
              className="news-card"
              onClick={() => onSelectArticle && onSelectArticle(item)}
            >
              <div className="news-card-img-wrap">
                <img src={item.imageUrl} alt={item.title} />
                <span className="news-card-badge">{item.category}</span>
              </div>

              <div className="news-card-body">
                <div className="news-card-meta">
                  <span><FiCalendar size={13} /> {item.date}</span>
                  {item.readTime && (
                    <>
                      <span>•</span>
                      <span><FiClock size={13} /> {item.readTime}</span>
                    </>
                  )}
                </div>

                <h3 className="news-card-title">{item.title}</h3>
                <p className="news-card-excerpt">{item.excerpt}</p>

                <div className="news-card-footer">
                  <span className="news-card-link">
                    Đọc tiếp <FiArrowRight className="arrow-icon" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

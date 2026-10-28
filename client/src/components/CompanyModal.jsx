import React, { useEffect } from 'react';
import { FiX, FiPhone, FiMapPin, FiMail, FiCheckCircle, FiAward } from 'react-icons/fi';
import '../styles/CompanyModal.css';

const LOGO = '/assets/logo.jpg';

export default function CompanyModal({ isOpen, onClose, config }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const phone = config?.phone1 || '0866.603.589';
  const address = config?.address || 'Thôn Xín Chải, Xã Sơn Vĩ, Tỉnh Tuyên Quang';
  const email = config?.email || 'yen.nhi.ruoumenla@gmail.com';

  return (
    <div className="company-modal-overlay" onClick={onClose}>
      <div
        className="company-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Nút đóng */}
        <button className="company-modal-close" onClick={onClose} aria-label="Đóng popup">
          <FiX size={20} />
        </button>

        {/* Header Modal */}
        <div className="company-modal-header">
          <div className="company-modal-brand">
            <img src={LOGO} alt="HTX Yến Nhi" className="company-modal-logo" />
            <div>
              <div className="company-modal-badge">
                <FiAward size={12} /> HỢP TÁC XÃ NÔNG SẢN TRUYỀN THỐNG
              </div>
              <h2 className="company-modal-title">
                HỢP TÁC XÃ DỊCH VỤ THƯƠNG MẠI YẾN NHI
              </h2>
              <p className="company-modal-subtitle">
                Gìn giữ &amp; lan tỏa tinh hoa rượu men lá truyền thống núi rừng Tuyên Quang
              </p>
            </div>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="company-modal-body">
          {/* Card 1: Câu chuyện & Sứ mệnh */}
          <div className="company-modal-card">
            <h3 className="company-card-heading">
              <span className="company-card-icon">🍃</span> Câu Chuyện Khởi Nguồn &amp; Sứ Mệnh
            </h3>
            <p className="company-card-text">
              Sinh ra từ núi rừng đại ngàn Sơn Vĩ - Tuyên Quang, <strong>Hợp Tác Xã Dịch Vụ Thương Mại Yến Nhi</strong> được thành lập với tâm huyết bảo tồn và kế thừa phương thức ủ rượu men lá độc bản của đồng bào các dân tộc thiểu số miền núi phía Bắc.
            </p>
            <p className="company-card-text">
              Chúng tôi tâm niệm rằng: <em>"Một giọt rượu ngon không chỉ làm ấm lòng người thưởng thức, mà còn là sợi dây gắn kết văn hóa, niềm tự hào của quê hương"</em>. Sứ mệnh của Yến Nhi là mang đến cho gia đình Việt sản phẩm rượu truyền thống sạch 100%, an toàn cho sức khỏe và chuẩn vị quê hương.
            </p>
          </div>

          {/* Card 2: 3 Giá trị cốt lõi */}
          <div className="company-modal-grid-highlights">
            <div className="company-highlight-item">
              <div className="highlight-icon-wrap">🌿</div>
              <h4>20+ Vị Thảo Dược Rừng</h4>
              <p>Men lá được ủ từ hơn 20 loại thảo dược, rễ cây thuốc quý thu hái tự nhiên từ rừng nguyên sinh trên độ cao 1.000m.</p>
            </div>
            <div className="company-highlight-item">
              <div className="highlight-icon-wrap">🌾</div>
              <h4>Gạo Nếp Nương Tinh Tuyển</h4>
              <p>Hạt gạo nếp dẻo thơm trồng trên ruộng bậc thang, hòa cùng nguồn nước khoáng tự nhiên trong lành từ khe suối núi.</p>
            </div>
            <div className="company-highlight-item">
              <div className="highlight-icon-wrap">🏺</div>
              <h4>Ủ Chum Sành Truyền Thống</h4>
              <p>Rượu được hạ thổ hoặc ủ trong chum sành không tráng men trên 12 tháng, giúp đào thải hoàn toàn độc tố Andehit.</p>
            </div>
          </div>

          {/* Card 3: Cam kết chất lượng */}
          <div className="company-modal-card quality-card">
            <h3 className="company-card-heading">
              <span className="company-card-icon">🛡️</span> Cam Kết Vàng Từ HTX Yến Nhi
            </h3>
            <ul className="company-commitments-list">
              <li>
                <FiCheckCircle className="check-icon" />
                <span><strong>100% Thuần Tự Nhiên:</strong> Không cồn công nghiệp, không hương liệu hay hóa chất bảo quản.</span>
              </li>
              <li>
                <FiCheckCircle className="check-icon" />
                <span><strong>Uống Êm Dịu - Tỉnh Táo:</strong> Không đau đầu, không khô cổ, thức dậy nhẹ nhõm, bồi bổ gân cốt và tiêu hóa.</span>
              </li>
              <li>
                <FiCheckCircle className="check-icon" />
                <span><strong>Chuẩn An Toàn Vệ Sinh:</strong> Quy trình sản xuất đạt chứng nhận cơ sở đủ điều kiện ATTP và định hướng chuẩn OCOP vùng cao.</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Thông tin liên hệ */}
          <div className="company-modal-contact-card">
            <div className="contact-row">
              <FiMapPin className="contact-icon" />
              <div>
                <strong>Trụ sở chính &amp; Xưởng sản xuất:</strong>
                <span>{address}</span>
              </div>
            </div>
            <div className="contact-row">
              <FiPhone className="contact-icon" />
              <div>
                <strong>Hotline tư vấn &amp; đặt hàng:</strong>
                <span><a href={`tel:${phone}`}>{phone}</a> (Hỗ trợ 24/7)</span>
              </div>
            </div>
            <div className="contact-row">
              <FiMail className="contact-icon" />
              <div>
                <strong>Thư điện tử:</strong>
                <span><a href={`mailto:${email}`}>{email}</a></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="company-modal-footer">
          <a href={`tel:${phone}`} className="btn btn-primary btn-modal-call">
            <FiPhone size={15} /> GỌI HOTLINE: {phone}
          </a>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            ĐÓNG LẠI
          </button>
        </div>
      </div>
    </div>
  );
}

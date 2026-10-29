import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiArrowRight, FiPhone, FiAward, FiShield } from 'react-icons/fi';
import '../styles/ProcessModal.css';

const DETAILED_STEPS = [
  {
    stepNumber: 1,
    title: 'Tuyển Chọn Gạo Nếp & Thảo Dược Vùng Cao',
    subtitle: 'Nền tảng của giọt rượu thuần khiết',
    imageUrl: '/assets/process-step-1.jpg',
    lead: 'Rượu ngon phải bắt nguồn từ nguyên liệu sạch và tinh túy nhất của đất trời vùng cao.',
    details: [
      'Gạo nếp nương: Lựa chọn những hạt nếp nương mùa vụ mới của đồng bào miền núi phía Bắc, hạt tròn đều, mẩy căng, khi nấu lên dẻo quánh và dậy mùi thơm nồng nàn.',
      'Nguồn nước khoáng tự nhiên: Sử dụng nước nguồn thanh khiết từ các khe suối đá trên núi cao, giàu khoáng chất tự nhiên, giúp rượu có hậu vị ngọt thanh mát lành.',
      'Sơ chế kỹ lưỡng: Gạo được ngâm và vo sạch bằng nước suối trong, loại bỏ hoàn toàn hạt lép và tạp chất trước khi đưa vào chõ gỗ đồ chín.'
    ],
    secret: 'Chỉ sử dụng nếp nương gieo trồng tự nhiên trên nương rẫy, tuyệt đối không dùng gạo pha tạp chất hay chất kích thích.'
  },
  {
    stepNumber: 2,
    title: 'Bí Quyết 20+ Vị Thảo Dược Men Lá Rừng',
    subtitle: 'Linh hồn tạo nên hương vị đặc trưng độc bản',
    imageUrl: '/assets/process-step-2.jpg',
    lead: 'Men lá không phải là men công nghiệp hay men hóa chất, mà là sự kết tinh của thảo dược rừng nguyên sinh.',
    details: [
      'Hơn 20 vị thảo dược quý: Người nghệ nhân phải trèo đèo lội suối vào rừng sâu ở độ cao hơn 1.000m để hái lá trầu rừng, hoàng đằng, quả ké đầu ngựa, trần bì, nhân trần, thảo quả...',
      'Chế biến công phu: Rửa sạch, phơi khô trong bóng râm (âm can) để giữ trọn tinh dầu, sau đó giã và nghiền mịn thành bột thuốc nam.',
      'Nặn bánh men thủ công: Bột thảo dược được nhào kỹ cùng bột gạo nếp, nặn thành từng bánh men tròn đều tay và ủ trong lớp rơm nếp khô sạch để men sinh sôi tự nhiên.'
    ],
    secret: 'Men lá giúp phân giải hoàn toàn các chất độc hại, làm rượu uống êm ru, ấm tỳ vị, lưu thông khí huyết và không bao giờ gây đau đầu hay khô cổ.'
  },
  {
    stepNumber: 3,
    title: 'Lên Men Tự Nhiên & Hạ Thổ Chum Sành',
    subtitle: 'Thời gian tôi luyện nên sự đằm thắm',
    imageUrl: '/assets/process-step-3.jpg',
    lead: 'Quá trình lên men và ủ đòi hỏi sự kiên nhẫn tuyệt đối, hòa cùng nhịp thở của tự nhiên.',
    details: [
      'Đồ cơm và trộn men: Cơm nếp nương sau khi đồ chín tới được trải đều ra nong tre cho nguội bớt, sau đó rắc đều bột men lá rừng theo tỷ lệ vàng gia truyền.',
      'Ủ khô và ủ ướt: Rượu trải qua quá trình lên men yếm khí tự nhiên trong điều kiện nhiệt độ phòng núi rừng mát mẻ quanh năm.',
      'Chum sành không tráng men: Chuyển toàn bộ bỗng rượu vào các chum gốm nung mộc tự nhiên. Độ xốp vi mô của chum sành giúp rượu "thở", thẩm thấu oxy và thúc đẩy quá trình lão hóa làm mềm giọt rượu.'
    ],
    secret: 'Rượu được hạ thổ hoặc ủ chum sành tối thiểu từ 6 đến 12 tháng, giúp đào thải triệt để độc tố Andehit và Methanol.'
  },
  {
    stepNumber: 4,
    title: 'Chưng Cất Nồi Đồng & Kiểm Định Đóng Chai',
    subtitle: 'Chắt lọc tinh hoa, đạt chuẩn ATTP & OCOP',
    imageUrl: '/assets/process-step-4.jpg',
    lead: 'Chưng cất thủ công kết hợp cùng quy trình kiểm định chất lượng khắt khe để đảm bảo an toàn tuyệt đối.',
    details: [
      'Nồi đồng truyền thống: Sử dụng nồi đồng thủ công và đun bằng củi lửa nhỏ liu riu, giữ nhiệt ổn định để giọt rượu ngưng tụ từ từ, gom trọn hương thơm tinh túy của thảo mộc.',
      'Hệ thống lọc tinh hiện đại: Rượu sau khi chưng cất được đưa qua hệ thống tháp lọc chuyên dụng để loại bỏ hoàn toàn cặn và tạp chất lơ lửng.',
      'Đóng chai & khử trùng: Đóng trong chai thủy tinh dày dặn hoặc nậm gốm đã qua khử trùng nhiệt độ cao, dán tem nhãn niêm phong chứng thực nguồn gốc xuất xứ của HTX Yến Nhi.'
    ],
    secret: 'Mỗi mẻ rượu xuất xưởng đều được đo nồng độ và kiểm nghiệm an toàn thực phẩm, đảm bảo chỉ số Methanol luôn ở mức an toàn gần như bằng 0.'
  }
];

export default function ProcessModal({ isOpen, onClose, initialStep = 1, onOpenOrder, hotline = '0866.603.589' }) {
  const [activeStep, setActiveStep] = useState(initialStep);

  useEffect(() => {
    if (initialStep) setActiveStep(initialStep);
  }, [initialStep]);

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

  const currentStep = DETAILED_STEPS[activeStep - 1] || DETAILED_STEPS[0];

  return (
    <div className="process-modal-overlay" onClick={onClose}>
      <div
        className="process-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="process-modal-close" onClick={onClose} aria-label="Đóng popup">
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="process-modal-header">
          <div className="process-modal-badge">
            <FiAward size={13} /> BÍ QUYẾT GIA TRUYỀN DÂN TỘC
          </div>
          <h2 className="process-modal-heading">
            CHI TIẾT 4 BƯỚC QUY TRÌNH NẤU RƯỢU MEN LÁ
          </h2>
          <p className="process-modal-sub">
            Khám phá trọn vẹn quy trình ủ nấu thủ công tạo nên giọt rượu êm dịu, chuẩn vị đại ngàn Tây Bắc
          </p>

          {/* Stepper Tabs */}
          <div className="process-stepper-tabs">
            {DETAILED_STEPS.map((s) => (
              <button
                key={s.stepNumber}
                type="button"
                className={`stepper-tab ${activeStep === s.stepNumber ? 'active' : ''}`}
                onClick={() => setActiveStep(s.stepNumber)}
              >
                <span className="tab-num">Bước {s.stepNumber}</span>
                <span className="tab-title">{s.title.split('&')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Body chi tiết bước đang chọn */}
        <div className="process-modal-body">
          <div className="step-detail-card">
            <div className="step-detail-top">
              <div className="step-detail-img-wrap">
                <img src={currentStep.imageUrl} alt={currentStep.title} />
                <span className="step-badge-large">BƯỚC {currentStep.stepNumber} / 4</span>
              </div>

              <div className="step-detail-info">
                <h3 className="step-detail-title">{currentStep.title}</h3>
                <div className="step-detail-subtitle">{currentStep.subtitle}</div>
                <p className="step-lead-text">{currentStep.lead}</p>

                <div className="step-secret-box">
                  <div className="secret-badge">
                    <FiShield size={14} /> BÍ QUYẾT YẾN NHI
                  </div>
                  <p>{currentStep.secret}</p>
                </div>
              </div>
            </div>

            {/* Chi tiết từng khâu */}
            <div className="step-phases-section">
              <h4 className="phases-heading">Các Khâu Thực Hiện Cốt Lõi:</h4>
              <div className="phases-list">
                {currentStep.details.map((detail, idx) => (
                  <div key={idx} className="phase-item">
                    <div className="phase-bullet">
                      <FiCheck size={14} />
                    </div>
                    <div className="phase-text">{detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal: Điều hướng bước và nút hành động */}
        <div className="process-modal-footer">
          <div className="stepper-nav-btns">
            <button
              type="button"
              className="btn btn-outline btn-step-nav"
              disabled={activeStep === 1}
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            >
              ← Bước trước
            </button>
            <button
              type="button"
              className="btn btn-primary btn-step-nav"
              disabled={activeStep === DETAILED_STEPS.length}
              onClick={() => setActiveStep(Math.min(DETAILED_STEPS.length, activeStep + 1))}
            >
              Bước tiếp theo →
            </button>
          </div>

          <div className="process-modal-cta">
            <a href={`tel:${hotline}`} className="btn btn-outline">
              <FiPhone size={15} /> Tư vấn: {hotline}
            </a>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                document.querySelector('#san-pham')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              XEM SẢN PHẨM <FiArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

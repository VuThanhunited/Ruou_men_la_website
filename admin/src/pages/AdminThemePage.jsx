import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiRotateCcw, FiArrowUp, FiArrowDown, FiEye, FiSliders } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import api from '../services/api';

export const THEME_PRESETS = [
  {
    id: 'forest',
    name: '🌲 Xanh Rừng Truyền Thống (Mặc định)',
    desc: 'Tông xanh lá rừng trầm mặc kết hợp vàng đồng và nền giấy kem mộc mạc',
    colors: {
      primaryColor: '#1C3319',
      primaryDarkColor: '#122210',
      primaryLightColor: '#2D5229',
      accentGoldColor: '#C59B5F',
      accentBrownColor: '#8C5A2B',
      bgColor: '#F4EFE6',
      bgAltColor: '#FAF6F0',
      textDarkColor: '#1E271D',
      textLightColor: '#F5EFE0',
    },
  },
  {
    id: 'wood',
    name: '🪵 Gỗ Mun & Chum Sành Cổ Điển',
    desc: 'Tông nâu trầm của chum sành hạ thổ và gỗ lũa vùng cao ấm áp',
    colors: {
      primaryColor: '#3E2723',
      primaryDarkColor: '#271714',
      primaryLightColor: '#5D4037',
      accentGoldColor: '#D4A359',
      accentBrownColor: '#8D5B4C',
      bgColor: '#F7F2EB',
      bgAltColor: '#FDFBF7',
      textDarkColor: '#2B1D1A',
      textLightColor: '#F7F2EB',
    },
  },
  {
    id: 'royal',
    name: '👑 Hoàng Gia Thượng Hạng',
    desc: 'Tông xanh đen sâu sang trọng phối ánh kim vàng rực rỡ cho dòng quà biếu',
    colors: {
      primaryColor: '#16262E',
      primaryDarkColor: '#0D181D',
      primaryLightColor: '#253D49',
      accentGoldColor: '#D4AF37',
      accentBrownColor: '#9A7B2C',
      bgColor: '#F5F3EE',
      bgAltColor: '#FFFFFF',
      textDarkColor: '#16262E',
      textLightColor: '#F8F6F0',
    },
  },
  {
    id: 'burgundy',
    name: '🍷 Đỏ Men Rượu Nồng Đượm',
    desc: 'Sắc đỏ trầm ấm áp thích hợp dịp lễ Tết, sum vầy và quà tặng đối tác',
    colors: {
      primaryColor: '#4A151B',
      primaryDarkColor: '#300C10',
      primaryLightColor: '#6B212A',
      accentGoldColor: '#C99E5A',
      accentBrownColor: '#8C5A2B',
      bgColor: '#F8F2EC',
      bgAltColor: '#FFFDF9',
      textDarkColor: '#2A1215',
      textLightColor: '#F9F3EB',
    },
  },
  {
    id: 'emerald',
    name: '🌿 Xanh Ngọc Đại Ngàn Tây Bắc',
    desc: 'Tông xanh ngọc lục bảo tươi mát của thảo dược rừng nguyên sinh',
    colors: {
      primaryColor: '#133832',
      primaryDarkColor: '#0B2420',
      primaryLightColor: '#1E5249',
      accentGoldColor: '#CCA462',
      accentBrownColor: '#8A6534',
      bgColor: '#F1F5F2',
      bgAltColor: '#F9FCFA',
      textDarkColor: '#122623',
      textLightColor: '#F2F7F4',
    },
  },
];

const DEFAULT_THEME = {
  preset: 'forest',
  ...THEME_PRESETS[0].colors,
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
};

const SECTION_LABELS = {
  usp: { label: '🏅 Thanh 5 Điểm nổi bật (USP)', toggleKey: 'showUsp' },
  split: { label: '🏺 Giới thiệu & Sản phẩm nổi bật', toggleKey: 'showProducts' },
  process: { label: '⚙️ Quy trình sản xuất 4 bước', toggleKey: 'showProcess' },
  brandStory: { label: '🌄 Banner Câu chuyện thương hiệu', toggleKey: 'showBrandStory' },
  news: { label: '📰 Tin tức & Văn hóa Men Lá', toggleKey: 'showNews' },
  testimonials: { label: '⭐ Đánh giá từ khách hàng', toggleKey: 'showTestimonials' },
};

const COLOR_FIELDS = [
  { key: 'primaryColor', label: 'Màu chủ đạo (Nút, Header, Tiêu đề)' },
  { key: 'primaryDarkColor', label: 'Màu chủ đạo đậm (Footer, Hover)' },
  { key: 'primaryLightColor', label: 'Màu chủ đạo sáng (Điểm nhấn phụ)' },
  { key: 'accentGoldColor', label: 'Màu vàng đồng (Viền ảnh, Sao, Huy hiệu)' },
  { key: 'accentBrownColor', label: 'Màu nâu đất (Nhãn phụ)' },
  { key: 'bgColor', label: 'Màu nền trang chính (Background)' },
  { key: 'bgAltColor', label: 'Màu nền khu vực xen kẽ' },
  { key: 'textDarkColor', label: 'Màu chữ chính (Trên nền sáng)' },
  { key: 'textLightColor', label: 'Màu chữ sáng (Trên nền tối/Banner)' },
];

export default function AdminThemePage() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/site-config')
      .then((res) => {
        const savedTheme = res.data.data?.theme;
        if (savedTheme) {
          setTheme({
            ...DEFAULT_THEME,
            ...savedTheme,
            sectionOrder: savedTheme.sectionOrder?.length
              ? savedTheme.sectionOrder
              : DEFAULT_THEME.sectionOrder,
          });
        }
      })
      .catch(() => toast.error('Không tải được cấu hình giao diện'))
      .finally(() => setLoading(false));
  }, []);

  const applyPreset = (presetObj) => {
    setTheme((prev) => ({
      ...prev,
      preset: presetObj.id,
      ...presetObj.colors,
    }));
    toast.info(`Đã áp dụng bảng màu: ${presetObj.name}`);
  };

  const handleResetDefault = () => {
    if (!window.confirm('Khôi phục toàn bộ màu sắc và bố cục về mặc định ban đầu?')) return;
    setTheme(DEFAULT_THEME);
    toast.info('Đã đặt lại giao diện mặc định (bấm Lưu để áp dụng)');
  };

  const moveSection = (index, direction) => {
    const order = [...(theme.sectionOrder || DEFAULT_THEME.sectionOrder)];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= order.length) return;
    const temp = order[index];
    order[index] = order[targetIndex];
    order[targetIndex] = temp;
    setTheme({ ...theme, sectionOrder: order });
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/theme', { theme });
      toast.success('✅ Đã lưu tùy chỉnh giao diện! Trang Client sẽ áp dụng ngay.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi lưu giao diện');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Tùy chỉnh Giao diện">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải cấu hình giao diện...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tùy chỉnh Giao diện & Bố cục (Theme)">
      <form onSubmit={handleSave}>
        {/* 1. Bảng màu Preset chọn nhanh */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">🎨 1. Chọn nhanh Chủ đề Giao diện (Presets)</div>
            <button type="button" className="admin-action-btn edit" onClick={handleResetDefault}>
              <FiRotateCcw /> Khôi phục mặc định
            </button>
          </div>
          <div className="admin-panel-body">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1rem',
              }}
            >
              {THEME_PRESETS.map((p) => {
                const isSelected = theme.preset === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => applyPreset(p)}
                    style={{
                      border: isSelected
                        ? '2px solid var(--color-primary)'
                        : '1.5px solid #e5e7eb',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(38,62,35,0.04)' : '#fff',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      {[
                        p.colors.primaryColor,
                        p.colors.primaryLightColor,
                        p.colors.accentGoldColor,
                        p.colors.bgColor,
                      ].map((hex, i) => (
                        <span
                          key={i}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: hex,
                            border: '1px solid rgba(0,0,0,0.15)',
                            display: 'inline-block',
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-dark)' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                      {p.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Chỉnh màu chi tiết & Xem trước trực tiếp */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          {/* Bảng chọn từng màu */}
          <div className="admin-panel-card">
            <div className="admin-panel-header">
              <div className="admin-panel-title">
                <FiSliders /> 2. Tùy chỉnh Màu sắc &amp; Kiểu chữ
              </div>
            </div>
            <div className="admin-panel-body">
              <div className="admin-form-grid">
                {COLOR_FIELDS.map(({ key, label }) => (
                  <div key={key} className="admin-form-group">
                    <label className="admin-form-label">{label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={theme[key] || '#000000'}
                        onChange={(e) =>
                          setTheme({ ...theme, preset: 'custom', [key]: e.target.value })
                        }
                        style={{
                          width: 40,
                          height: 38,
                          padding: 2,
                          border: '1px solid #d1d5db',
                          borderRadius: 6,
                          cursor: 'pointer',
                          background: '#fff',
                        }}
                      />
                      <input
                        type="text"
                        className="admin-form-input"
                        value={theme[key] || ''}
                        onChange={(e) =>
                          setTheme({ ...theme, preset: 'custom', [key]: e.target.value })
                        }
                        style={{ flex: 1, fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                ))}

                {/* Fonts */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Font chữ Nghệ thuật (Script)</label>
                  <select
                    className="admin-form-select"
                    value={theme.fontScript}
                    onChange={(e) => setTheme({ ...theme, fontScript: e.target.value })}
                  >
                    <option value="'Dancing Script', cursive">Dancing Script (Mặc định)</option>
                    <option value="'Great Vibes', cursive">Great Vibes (Thư pháp mềm)</option>
                    <option value="'Playfair Display', serif">Playfair Display (Cổ điển)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Font Tiêu đề (Serif)</label>
                  <select
                    className="admin-form-select"
                    value={theme.fontSerif}
                    onChange={(e) => setTheme({ ...theme, fontSerif: e.target.value })}
                  >
                    <option value="'Lora', 'Playfair Display', Georgia, serif">Lora (Mặc định)</option>
                    <option value="'Playfair Display', Georgia, serif">Playfair Display</option>
                    <option value="Georgia, serif">Georgia Classic</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">
                    Độ phủ nền Hero ({theme.heroOverlayOpacity ?? 85}%)
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={95}
                    value={theme.heroOverlayOpacity ?? 85}
                    onChange={(e) => setTheme({ ...theme, heroOverlayOpacity: +e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">
                    Độ phủ nền Câu chuyện TH ({theme.storyOverlayOpacity ?? 88}%)
                  </label>
                  <input
                    type="range"
                    min={30}
                    max={98}
                    value={theme.storyOverlayOpacity ?? 88}
                    onChange={(e) => setTheme({ ...theme, storyOverlayOpacity: +e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="admin-panel-card">
            <div className="admin-panel-header">
              <div className="admin-panel-title">
                <FiEye /> Xem trước Giao diện (Live Preview)
              </div>
            </div>
            <div className="admin-panel-body">
              <div
                style={{
                  background: theme.bgColor,
                  color: theme.textDarkColor,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: `2px solid ${theme.accentGoldColor}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                }}
              >
                {/* Mini Navbar */}
                <div
                  style={{
                    background: theme.primaryColor,
                    color: theme.textLightColor,
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `2px solid ${theme.accentGoldColor}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img
                      src="/assets/logo.jpg"
                      alt="Logo"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        border: `1.5px solid ${theme.accentGoldColor}`,
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>Rượu Men Lá Yến Nhi</span>
                  </div>
                  <span
                    style={{
                      background: theme.accentGoldColor,
                      color: '#fff',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 999,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    Hotline
                  </span>
                </div>

                {/* Mini Hero */}
                <div style={{ padding: '1.25rem' }}>
                  <div
                    style={{
                      fontFamily: theme.fontScript,
                      fontSize: '2.2rem',
                      color: theme.primaryColor,
                      lineHeight: 1,
                    }}
                  >
                    Rượu Men Lá
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fontSerif,
                      fontSize: '0.85rem',
                      color: theme.accentBrownColor,
                      marginTop: 4,
                      fontWeight: 600,
                    }}
                  >
                    Hương vị truyền thống từ núi rừng quê hương
                  </div>
                  <p style={{ fontSize: '0.76rem', marginTop: 8, opacity: 0.85, lineHeight: 1.5 }}>
                    Ủ từ nguyên liệu thiên nhiên và hơn 20 vị thảo dược quý hiếm vùng cao.
                  </p>
                  <button
                    type="button"
                    style={{
                      marginTop: 10,
                      background: theme.primaryColor,
                      color: theme.textLightColor,
                      border: 'none',
                      padding: '0.45rem 1rem',
                      borderRadius: 999,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    KHÁM PHÁ SẢN PHẨM →
                  </button>
                </div>

                {/* Mini Product Section */}
                <div
                  style={{
                    background: theme.bgAltColor,
                    padding: '1rem 1.25rem',
                    borderTop: `1px solid ${theme.accentGoldColor}44`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: theme.fontSerif,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: theme.primaryColor,
                      textAlign: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    SẢN PHẨM NỔI BẬT
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[1, 2].map((n) => (
                      <div
                        key={n}
                        style={{
                          background: '#fff',
                          borderRadius: 8,
                          padding: '0.6rem',
                          border: `1px solid ${theme.accentGoldColor}55`,
                          textAlign: 'center',
                        }}
                      >
                        <img
                          src={`/assets/product-${n}.jpg`}
                          alt=""
                          style={{
                            width: '100%',
                            height: 64,
                            objectFit: 'cover',
                            borderRadius: 6,
                            marginBottom: 6,
                          }}
                        />
                        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: theme.primaryColor }}>
                          Rượu Men Lá {n === 1 ? '500ml' : '750ml'}
                        </div>
                        <div
                          style={{
                            marginTop: 6,
                            background: theme.primaryColor,
                            color: '#fff',
                            borderRadius: 999,
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.65rem',
                            display: 'inline-block',
                          }}
                        >
                          XEM CHI TIẾT
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Footer */}
                <div
                  style={{
                    background: theme.primaryDarkColor,
                    color: theme.textLightColor,
                    padding: '0.6rem 1rem',
                    fontSize: '0.7rem',
                    textAlign: 'center',
                  }}
                >
                  © HTX Dịch Vụ Thương Mại Yến Nhi
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bố cục Trang chủ: Bật/Tắt & Sắp xếp thứ tự các Section */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              📐 3. Bố cục Trang chủ (Bật/Tắt &amp; Sắp xếp thứ tự các khu vực)
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Dùng mũi tên Lên/Xuống để đổi vị trí hiển thị trên trang Client
            </span>
          </div>
          <div className="admin-panel-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {(theme.sectionOrder || DEFAULT_THEME.sectionOrder).map((secKey, idx, arr) => {
                const meta = SECTION_LABELS[secKey];
                if (!meta) return null;
                const isVisible = theme[meta.toggleKey] !== false;
                return (
                  <div
                    key={secKey}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.1rem',
                      background: isVisible ? '#fff' : '#f9fafb',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: 'var(--radius-md)',
                      opacity: isVisible ? 1 : 0.6,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: 'var(--color-primary)',
                          color: '#fff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>
                        {meta.label}
                      </span>
                      {secKey === 'split' && (
                        <label
                          style={{
                            marginLeft: '1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.78rem',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={theme.showIntro !== false}
                            onChange={(e) => setTheme({ ...theme, showIntro: e.target.checked })}
                          />
                          Hiện cột Banner Giới thiệu bên trái
                        </label>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                        }}
                      >
                        <label className="admin-toggle">
                          <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={(e) =>
                              setTheme({ ...theme, [meta.toggleKey]: e.target.checked })
                            }
                          />
                          <span className="admin-toggle-slider" />
                        </label>
                        {isVisible ? 'Đang hiện' : 'Đang ẩn'}
                      </label>

                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="admin-action-btn edit"
                          disabled={idx === 0}
                          onClick={() => moveSection(idx, -1)}
                          title="Di chuyển lên"
                        >
                          <FiArrowUp />
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn edit"
                          disabled={idx === arr.length - 1}
                          onClick={() => moveSection(idx, 1)}
                          title="Di chuyển xuống"
                        >
                          <FiArrowDown />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="admin-action-btn save" disabled={saving}>
            <FiSave /> {saving ? 'Đang lưu...' : 'Lưu tùy chỉnh giao diện'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}


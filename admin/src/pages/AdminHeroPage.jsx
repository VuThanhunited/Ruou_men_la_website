import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import ImageCropperField from '../components/ImageCropperField';
import api from '../services/api';

export default function AdminHeroPage() {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    hotline: '',
    sideBannerText: '',
  });
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({
    logoUrl: '/assets/logo.jpg',
    heroBgUrl: '/assets/hero-bg.jpg',
    heroProductUrl: '',
    sideBannerBgUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/hero')
      .then((res) => {
        const d = res.data.data || {};
        setForm({
          title: d.title || '',
          subtitle: d.subtitle || '',
          description: d.description || '',
          ctaText: d.ctaText || '',
          ctaLink: d.ctaLink || '',
          hotline: d.hotline || '',
          sideBannerText: d.sideBannerText || '',
        });
        setPreviews({
          logoUrl: d.logoUrl || '/assets/logo.jpg',
          heroBgUrl: d.heroBgUrl || '/assets/hero-bg.jpg',
          heroProductUrl: d.heroProductUrl || '',
          sideBannerBgUrl: d.sideBannerBgUrl || '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCropped = (fieldName) => (file, url) => {
    if (file) {
      setFiles((prev) => ({ ...prev, [fieldName]: file }));
      setPreviews((prev) => ({ ...prev, [fieldName]: url || '' }));
    } else {
      setFiles((prev) => {
        const n = { ...prev };
        delete n[fieldName];
        return n;
      });
      setPreviews((prev) => ({ ...prev, [fieldName]: url || '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      ['logoUrl', 'heroBgUrl', 'heroProductUrl', 'sideBannerBgUrl'].forEach((field) => {
        if (files[field]) {
          fd.append(field, files[field]);
        } else {
          fd.append(field, previews[field] || '');
        }
      });

      const res = await api.put('/admin/hero', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = res.data.data || {};
      setPreviews({
        logoUrl: updated.logoUrl || '',
        heroBgUrl: updated.heroBgUrl || '',
        heroProductUrl: updated.heroProductUrl || '',
        sideBannerBgUrl: updated.sideBannerBgUrl || '',
      });
      setFiles({});
      toast.success('✅ Lưu Hero, Banner & Logo thành công!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Hero, Banner & Logo">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Đang tải...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản lý Hero Banner & Logo">
      <form onSubmit={handleSubmit}>
        {/* Images Card */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">🖼️ Hình ảnh Logo &amp; Banner Hero</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Có thể tải ảnh từ máy tính, cắt theo tỷ lệ, nhập link URL hoặc chọn từ kho ảnh mẫu
            </span>
          </div>
          <div className="admin-panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <ImageCropperField
                label="Logo thương hiệu (Hiển thị trên Navbar, Footer & Popup)"
                preset="CIRCLE"
                currentUrl={previews.logoUrl}
                onCropped={handleCropped('logoUrl')}
              />
              <ImageCropperField
                label="Ảnh nền Banner Hero (Toàn màn hình đầu trang)"
                preset="HERO_BG"
                currentUrl={previews.heroBgUrl}
                onCropped={handleCropped('heroBgUrl')}
              />
              <ImageCropperField
                label="Ảnh sản phẩm nổi bật góc phải Hero (Chum rượu PNG - tùy chọn)"
                preset="INTRO_BANNER"
                currentUrl={previews.heroProductUrl}
                onCropped={handleCropped('heroProductUrl')}
              />
              <ImageCropperField
                label="Ảnh nền bảng gỗ bên cạnh (Tùy chọn)"
                preset="FREE"
                currentUrl={previews.sideBannerBgUrl}
                onCropped={handleCropped('sideBannerBgUrl')}
              />
            </div>
          </div>
        </div>

        {/* Text Content Card */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">✏️ Nội dung văn bản trên Hero &amp; Navbar</div>
          </div>
          <div className="admin-panel-body">
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Tiêu đề chính (Xuống dòng để tách chữ "Rượu" và "Men Lá")
                </label>
                <textarea
                  className="admin-form-textarea"
                  rows={2}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Rượu&#10;Men Lá"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Số Hotline (Hiện trên thanh Navbar &amp; Đặt hàng)</label>
                <input
                  className="admin-form-input"
                  value={form.hotline}
                  onChange={(e) => setForm({ ...form, hotline: e.target.value })}
                  placeholder="0372.477.078"
                />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">Khẩu hiệu phụ (Subtitle)</label>
                <input
                  className="admin-form-input"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Hương vị truyền thống từ núi rừng quê hương"
                />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">Đoạn mô tả ngắn</label>
                <textarea
                  className="admin-form-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Chữ nút hành động (CTA)</label>
                <input
                  className="admin-form-input"
                  value={form.ctaText}
                  onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                  placeholder="KHÁM PHÁ SẢN PHẨM"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Liên kết nút CTA</label>
                <input
                  className="admin-form-input"
                  value={form.ctaLink}
                  onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                  placeholder="#san-pham"
                />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">Chữ trên bảng gỗ bên cạnh</label>
                <input
                  className="admin-form-input"
                  value={form.sideBannerText}
                  onChange={(e) => setForm({ ...form, sideBannerText: e.target.value })}
                  placeholder="Rượu sạch từ thiên nhiên"
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="admin-action-btn save" disabled={saving}>
            <FiSave /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

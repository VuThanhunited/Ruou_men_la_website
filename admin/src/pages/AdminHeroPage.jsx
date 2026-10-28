import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import ImageCropperField, { CROP_PRESETS } from '../components/ImageCropperField';
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
  const [currentData, setCurrentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/hero').then((res) => {
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
      setCurrentData(d);
    }).finally(() => setLoading(false));
  }, []);

  const handleCropped = (fieldName) => (file) => {
    if (file) setFiles((prev) => ({ ...prev, [fieldName]: file }));
    else setFiles((prev) => { const n = { ...prev }; delete n[fieldName]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      Object.entries(files).forEach(([k, v]) => { if (v) fd.append(k, v); });
      await api.put('/admin/hero', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('✅ Lưu Hero Section thành công!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Hero & Navbar">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Đang tải...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản lý Hero Section">
      <form onSubmit={handleSubmit}>
        {/* Images Card */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">🖼️ Hình ảnh Hero</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Ảnh sẽ tự động cắt đúng tỷ lệ và chuyển sang .webp
            </span>
          </div>
          <div className="admin-panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <ImageCropperField
                label="Logo tròn (Navbar + Footer)"
                preset="CIRCLE"
                currentUrl={currentData.logoUrl}
                onCropped={handleCropped('logoUrl')}
              />
              <ImageCropperField
                label="Ảnh nền Hero (Ruộng bậc thang)"
                preset="HERO_BG"
                currentUrl={currentData.heroBgUrl}
                onCropped={handleCropped('heroBgUrl')}
              />
              <ImageCropperField
                label="Ảnh sản phẩm tiền cảnh (Chum rượu PNG)"
                preset="INTRO_BANNER"
                currentUrl={currentData.heroProductUrl}
                onCropped={handleCropped('heroProductUrl')}
              />
              <ImageCropperField
                label="Ảnh bảng gỗ bên cạnh (tùy chọn)"
                preset="FREE"
                currentUrl={currentData.sideBannerBgUrl}
                onCropped={handleCropped('sideBannerBgUrl')}
              />
            </div>
          </div>
        </div>

        {/* Text Content Card */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">✏️ Nội dung văn bản</div>
          </div>
          <div className="admin-panel-body">
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Tiêu đề chính (Font Script lớn)
                </label>
                <input
                  className="admin-form-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Rượu Men Lá"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Hotline (hiện trên Navbar)</label>
                <input
                  className="admin-form-input"
                  value={form.hotline}
                  onChange={(e) => setForm({ ...form, hotline: e.target.value })}
                  placeholder="0866.603.589"
                />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">
                  Subtitle (Font Script vừa)
                </label>
                <input
                  className="admin-form-input"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Hương vị truyền thống từ núi rừng quê hương"
                />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">Đoạn mô tả ngắn (Body text)</label>
                <textarea
                  className="admin-form-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Text nút CTA</label>
                <input
                  className="admin-form-input"
                  value={form.ctaText}
                  onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                  placeholder="KHÁM PHÁ SẢN PHẨM"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Link nút CTA</label>
                <input
                  className="admin-form-input"
                  value={form.ctaLink}
                  onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                  placeholder="/san-pham"
                />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">
                  Chữ bảng gỗ bên cạnh
                </label>
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


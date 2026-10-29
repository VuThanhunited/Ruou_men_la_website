import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import ImageCropperField from '../components/ImageCropperField';
import api from '../services/api';

export default function AdminIntroPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/intro')
      .then((res) => {
        const d = res.data.data || {};
        setForm({
          title: d.title || '',
          description: d.description || '',
          buttonText: d.buttonText || '',
          buttonLink: d.buttonLink || '',
        });
        setBannerPreview(d.introBannerUrl || d.introBgUrl || '/assets/intro-bg.jpg');
      })
      .catch(() => toast.error('Lỗi tải dữ liệu Giới thiệu'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (bannerFile) {
        fd.append('introBannerUrl', bannerFile);
      } else {
        fd.append('introBannerUrl', bannerPreview);
      }
      await api.put('/admin/intro', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('✅ Đã lưu Banner Giới thiệu thành công!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi lưu dữ liệu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Quản lý Giới thiệu">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Banner Giới thiệu (Cạnh Sản phẩm nổi bật)">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Hình ảnh Banner */}
          <div className="admin-panel-card">
            <div className="admin-panel-header">
              <div className="admin-panel-title">🖼️ Ảnh nền Banner Giới thiệu</div>
            </div>
            <div className="admin-panel-body">
              <ImageCropperField
                label="Ảnh nền cột trái (Tinh hoa Men Lá Việt)"
                preset="INTRO_BANNER"
                currentUrl={bannerPreview}
                onCropped={(file, url) => {
                  setBannerFile(file || null);
                  setBannerPreview(url || '');
                }}
              />
            </div>
          </div>

          {/* Xem trước trực tiếp */}
          <div className="admin-panel-card">
            <div className="admin-panel-header">
              <div className="admin-panel-title">👁️ Xem trước Banner Giới thiệu</div>
            </div>
            <div className="admin-panel-body">
              <div
                style={{
                  position: 'relative',
                  minHeight: 300,
                  borderRadius: 12,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1.75rem',
                  background: bannerPreview
                    ? `url(${bannerPreview}) center/cover no-repeat`
                    : 'linear-gradient(160deg, #1a3318 0%, #2d5426 100%)',
                  color: '#F5EFE0',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(160deg, rgba(20,35,18,0.88) 0%, rgba(20,35,18,0.68) 50%, rgba(20,35,18,0.2) 100%)',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-script)',
                      fontSize: '2.2rem',
                      lineHeight: 1.05,
                      marginBottom: '0.75rem',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {form.title || 'Tinh hoa\nMen Lá Việt'}
                  </div>
                  <p style={{ fontSize: '0.82rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '1rem' }}>
                    {form.description}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.45rem 1.1rem',
                      border: '1.5px solid #F5EFE0',
                      borderRadius: 999,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {form.buttonText || 'TÌM HIỂU NGAY'} →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung văn bản */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">✏️ Nội dung văn bản</div>
          </div>
          <div className="admin-panel-body">
            <div className="admin-form-grid">
              <div className="admin-form-group full-width">
                <label className="admin-form-label">
                  Tiêu đề nghệ thuật (Có thể xuống dòng)
                </label>
                <textarea
                  className="admin-form-textarea"
                  rows={2}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Tinh hoa&#10;Men Lá Việt"
                />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">Đoạn mô tả giới thiệu</label>
                <textarea
                  className="admin-form-textarea"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Chữ trên nút bấm</label>
                <input
                  className="admin-form-input"
                  value={form.buttonText}
                  onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                  placeholder="TÌM HIỂU NGAY"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Liên kết nút bấm</label>
                <input
                  className="admin-form-input"
                  value={form.buttonLink}
                  onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                  placeholder="#gioi-thieu"
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


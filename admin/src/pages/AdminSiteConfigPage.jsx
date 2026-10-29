import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import ImageCropperField from '../components/ImageCropperField';
import api from '../services/api';

export default function AdminSiteConfigPage() {
  const [form, setForm] = useState({
    companyName: '',
    address: '',
    phone1: '',
    phone2: '',
    email: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    zaloUrl: '',
    metaTitle: '',
    metaDescription: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/site-config')
      .then((res) => {
        const d = res.data.data || {};
        setLogoPreview(d.footerLogoUrl || '/assets/logo.jpg');
        setForm({
          companyName: d.companyName || '',
          address: d.address || '',
          phone1: d.phone1 || '',
          phone2: d.phone2 || '',
          email: d.email || '',
          facebookUrl: d.facebookUrl || '',
          instagramUrl: d.instagramUrl || '',
          youtubeUrl: d.youtubeUrl || '',
          tiktokUrl: d.tiktokUrl || '',
          zaloUrl: d.zaloUrl || '',
          metaTitle: d.metaTitle || '',
          metaDescription: d.metaDescription || '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logoFile) {
        fd.append('footerLogoUrl', logoFile);
      } else {
        fd.append('footerLogoUrl', logoPreview);
      }
      await api.put('/admin/site-config', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('✅ Đã lưu cấu hình chung & Logo!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi lưu cấu hình');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Cấu hình Website">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Cấu hình Chung & Footer">
      <form onSubmit={handleSubmit}>
        {/* Logo — Circle crop */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">🖼️ Logo Thương hiệu (Navbar, Footer &amp; Popup)</div>
          </div>
          <div className="admin-panel-body">
            <div style={{ maxWidth: 440 }}>
              <ImageCropperField
                label="Logo tròn HTX Yến Nhi"
                preset="CIRCLE"
                currentUrl={logoPreview}
                onCropped={(file, url) => {
                  setLogoFile(file || null);
                  setLogoPreview(url || '');
                }}
              />
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">🏢 Thông tin Hợp tác xã</div>
          </div>
          <div className="admin-panel-body">
            <div className="admin-form-grid">
              <div className="admin-form-group full-width">
                <label className="admin-form-label">Tên đơn vị</label>
                <input
                  className="admin-form-input"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">Địa chỉ</label>
                <input
                  className="admin-form-input"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Số điện thoại 1</label>
                <input
                  className="admin-form-input"
                  value={form.phone1}
                  onChange={(e) => setForm({ ...form, phone1: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Số điện thoại 2</label>
                <input
                  className="admin-form-input"
                  value={form.phone2}
                  onChange={(e) => setForm({ ...form, phone2: e.target.value })}
                />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">Email liên hệ</label>
                <input
                  type="email"
                  className="admin-form-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">📱 Mạng xã hội</div>
          </div>
          <div className="admin-panel-body">
            <div className="admin-form-grid">
              {[
                { label: '🔵 Facebook URL', key: 'facebookUrl', placeholder: 'https://facebook.com/...' },
                { label: '▶️ YouTube URL', key: 'youtubeUrl', placeholder: 'https://youtube.com/...' },
                { label: '🎵 TikTok URL', key: 'tiktokUrl', placeholder: 'https://tiktok.com/@...' },
                { label: '💬 Zalo URL / Link', key: 'zaloUrl', placeholder: 'https://zalo.me/...' },
                { label: '📸 Instagram URL', key: 'instagramUrl', placeholder: 'https://instagram.com/...' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="admin-form-group">
                  <label className="admin-form-label">{label}</label>
                  <input
                    className="admin-form-input"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">🔍 SEO Meta Tags</div>
          </div>
          <div className="admin-panel-body">
            <div className="admin-form-grid">
              <div className="admin-form-group full-width">
                <label className="admin-form-label">
                  Meta Title{' '}
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    (Hiện trên tab trình duyệt &amp; Google — nên 50-60 ký tự)
                  </span>
                </label>
                <input
                  className="admin-form-input"
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                />
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: form.metaTitle.length > 60 ? '#ef4444' : 'var(--color-text-muted)',
                    marginTop: 2,
                  }}
                >
                  {form.metaTitle.length}/60 ký tự
                </div>
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">
                  Meta Description{' '}
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    (Mô tả ngắn trên Google — nên 150-160 ký tự)
                  </span>
                </label>
                <textarea
                  className="admin-form-textarea"
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  rows={3}
                />
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: form.metaDescription.length > 160 ? '#ef4444' : 'var(--color-text-muted)',
                    marginTop: 2,
                  }}
                >
                  {form.metaDescription.length}/160 ký tự
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="admin-action-btn save" disabled={saving}>
            <FiSave /> {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import ImageCropperField from '../components/ImageCropperField';
import api from '../services/api';

export default function AdminBrandStoryPage() {
  const [form, setForm] = useState({
    title: '', subTitle: '', description: '', buttonText: '', buttonLink: '',
  });
  const [bgCroppedFile, setBgCroppedFile] = useState(null);
  const [bgCroppedPreview, setBgCroppedPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/brand-story').then((res) => {
      const d = res.data.data || {};
      setForm({
        title: d.title || '', subTitle: d.subTitle || '',
        description: d.description || '', buttonText: d.buttonText || '', buttonLink: d.buttonLink || '',
      });
      setBgCroppedPreview(d.storyBgUrl || '');
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (bgCroppedFile) {
        fd.append('storyBgUrl', bgCroppedFile);
      } else {
        fd.append('storyBgUrl', bgCroppedPreview);
      }
      await api.put('/admin/brand-story', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('✅ Lưu Câu chuyện thương hiệu thành công');
    } catch { toast.error('Lỗi lưu'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <AdminLayout title="Câu chuyện Thương hiệu">
      <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Câu chuyện Thương hiệu">
      <form onSubmit={handleSubmit}>
        {/* Banner Background — ULTRA WIDE 21:9 */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">🌄 Ảnh nền Banner toàn chiều rộng</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              💡 Gradient tối sẽ tự động che phủ để chữ trắng luôn đọc được
            </span>
          </div>
          <div className="admin-panel-body">
            <ImageCropperField
              label="Ảnh nền bản làng nhà sàn miền núi"
              preset="BANNER_ULTRA"
              currentUrl={bgCroppedPreview}
              onCropped={(file, url) => {
                setBgCroppedFile(file || null);
                setBgCroppedPreview(url || '');
              }}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div className="admin-panel-title">✏️ Nội dung</div>
          </div>
          <div className="admin-panel-body">
            <div className="admin-form-grid">
              <div className="admin-form-group full-width">
                <label className="admin-form-label">
                  Label phía trên (In hoa · Serif) — VD: "CÂU CHUYỆN THƯƠNG HIỆU"
                </label>
                <input className="admin-form-input" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">
                  Tiêu đề Script (lớn) — VD: "Hương rượu từ núi rừng"
                </label>
                <input className="admin-form-input" value={form.subTitle}
                  onChange={(e) => setForm({ ...form, subTitle: e.target.value })} />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">Đoạn mô tả câu chuyện thương hiệu</label>
                <textarea className="admin-form-textarea" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Text nút CTA</label>
                <input className="admin-form-input" value={form.buttonText}
                  onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                  placeholder="VỀ CHÚNG TÔI" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Link nút CTA</label>
                <input className="admin-form-input" value={form.buttonLink}
                  onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                  placeholder="/gioi-thieu" />
              </div>
            </div>
          </div>
        </div>

        {/* Preview gradient note */}
        <div style={{
          background: 'rgba(38,62,35,0.06)', borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem', marginBottom: '1rem',
          border: '1px solid rgba(38,62,35,0.1)', fontSize: '0.82rem',
          color: 'var(--color-text-body)', display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🛡️</span>
          <div>
            <strong>Lớp bảo vệ gradient tự động:</strong> Dù Admin upload ảnh sáng màu bất kỳ,
            giao diện sẽ luôn phủ lớp gradient xanh rêu đậm từ phải sang để đảm bảo
            chữ trắng bên trên luôn đọc rõ mà không vỡ layout.
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


import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import AdminLayout from './AdminLayout';
import ImageCropperField from '../components/ImageCropperField';
import api from '../services/api';

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    comment: '', customerName: '', location: '', rating: 5, isActive: true, order: 0,
  });
  const [croppedFile, setCroppedFile] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await api.get('/admin/testimonials');
      setItems(res.data.data);
    } catch { toast.error('Lỗi tải danh sách'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({ comment: '', customerName: '', location: '', rating: 5, isActive: true, order: items.length + 1 });
    setCroppedFile(null); setCroppedPreview('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ comment: item.comment, customerName: item.customerName, location: item.location || '', rating: item.rating, isActive: item.isActive, order: item.order });
    setCroppedPreview(item.avatarUrl || ''); setCroppedFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.comment.trim() || !form.customerName.trim()) return toast.error('Vui lòng nhập đầy đủ thông tin');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (croppedFile) {
        fd.append('avatarUrl', croppedFile);
      } else {
        fd.append('avatarUrl', croppedPreview);
      }
      if (editItem) {
        await api.put(`/admin/testimonials/${editItem._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('✅ Đã cập nhật đánh giá');
      } else {
        await api.post('/admin/testimonials', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('✅ Đã thêm đánh giá');
      }
      setModalOpen(false); fetchItems();
    } catch (err) { toast.error(err.response?.data?.message || 'Có lỗi'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa đánh giá của "${name}"?`)) return;
    try { await api.delete(`/admin/testimonials/${id}`); toast.success('Đã xóa'); fetchItems(); }
    catch { toast.error('Lỗi xóa'); }
  };

  return (
    <AdminLayout title="Quản lý Đánh giá Khách hàng">
      <div className="admin-panel-card">
        <div className="admin-panel-header">
          <div className="admin-panel-title">⭐ Đánh giá khách hàng</div>
          <button className="admin-action-btn save" onClick={openCreate}>
            <FiPlus /> Thêm đánh giá
          </button>
        </div>
        <div className="admin-panel-body" style={{ padding: 0 }}>
          {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Avatar (tròn)</th><th>Nội dung</th><th>Tên</th><th>Tỉnh/TP</th><th>Sao</th><th>Hiển thị</th><th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {/* Avatar luôn tròn bằng CSS */}
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', overflow: 'hidden',
                        border: '2px solid var(--color-accent-gold)', flexShrink: 0,
                        background: 'var(--color-primary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        {item.avatarUrl
                          ? <img src={item.avatarUrl} alt={item.customerName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                              {item.customerName?.[0]?.toUpperCase()}
                            </span>
                        }
                      </div>
                    </td>
                    <td style={{ maxWidth: 240, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      <em>"{item.comment.length > 80 ? item.comment.slice(0, 80) + '...' : item.comment}"</em>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.customerName}</td>
                    <td>{item.location}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <AiFillStar key={i} style={{ color: i < item.rating ? 'var(--color-accent-gold)' : '#e5e7eb', fontSize: '0.9rem' }} />
                        ))}
                      </div>
                    </td>
                    <td><span className={`admin-badge ${item.isActive ? 'active' : 'inactive'}`}>{item.isActive ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="admin-action-btn edit" onClick={() => openEdit(item)}><FiEdit2 /> Sửa</button>
                        <button className="admin-action-btn delete" onClick={() => handleDelete(item._id, item.customerName)}><FiTrash2 /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">{editItem ? '✏️ Sửa đánh giá' : '➕ Thêm đánh giá mới'}</div>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}><FiX /></button>
            </div>
            <div className="admin-modal-body">
              {/* Avatar — crop tròn 1:1 */}
              <ImageCropperField
                label="Ảnh đại diện khách hàng"
                preset="CIRCLE"
                currentUrl={croppedPreview}
                onCropped={(file, url) => { setCroppedFile(file || null); setCroppedPreview(url || ''); }}
              />

              <div className="admin-form-grid" style={{ marginTop: '1.25rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Tên khách hàng *</label>
                  <input className="admin-form-input" value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Tỉnh/Thành phố</label>
                  <input className="admin-form-input" value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Hà Nội" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Số sao đánh giá</label>
                  <select className="admin-form-select" value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: +e.target.value })}>
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ⭐</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Thứ tự</label>
                  <input type="number" className="admin-form-input" value={form.order}
                    onChange={(e) => setForm({ ...form, order: +e.target.value })} />
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Nội dung đánh giá *</label>
                  <textarea className="admin-form-textarea" value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })} rows={4}
                    placeholder="Rượu thơm, êm dễ uống..." />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <label className="admin-toggle">
                      <input type="checkbox" checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                      <span className="admin-toggle-slider" />
                    </label>
                    Hiển thị trên trang chủ
                  </label>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-action-btn"
                style={{ padding: '0.625rem 1.5rem', borderRadius: 'var(--radius-full)', border: '1.5px solid #e5e7eb' }}
                onClick={() => setModalOpen(false)}>
                Hủy
              </button>
              <button className="admin-action-btn save" onClick={handleSave} disabled={saving}>
                <FiSave /> {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


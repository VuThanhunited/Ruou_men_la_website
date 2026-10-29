import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import ImageCropperField from '../components/ImageCropperField';
import api from '../services/api';

export default function AdminUspPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    title: '',
    subTitle: '',
    order: 1,
    isActive: true,
  });
  const [croppedFile, setCroppedFile] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsp = async () => {
    try {
      const res = await api.get('/admin/usp');
      setItems(res.data.data || []);
    } catch {
      toast.error('Lỗi tải danh sách điểm nổi bật');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsp();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({
      title: '',
      subTitle: '',
      order: items.length + 1,
      isActive: true,
    });
    setCroppedFile(null);
    setCroppedPreview('/assets/icons/usp-nature.svg');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title || '',
      subTitle: item.subTitle || '',
      order: item.order || 1,
      isActive: item.isActive !== false,
    });
    setCroppedFile(null);
    setCroppedPreview(item.iconUrl || '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Vui lòng nhập tiêu đề điểm nổi bật');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (croppedFile) {
        fd.append('iconUrl', croppedFile);
      } else {
        fd.append('iconUrl', croppedPreview);
      }

      if (editItem) {
        await api.put(`/admin/usp/${editItem._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✅ Đã cập nhật điểm nổi bật');
      } else {
        await api.post('/admin/usp', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✅ Đã thêm điểm nổi bật mới');
      }
      setModalOpen(false);
      fetchUsp();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi lưu dữ liệu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa điểm nổi bật "${title}"?`)) return;
    try {
      await api.delete(`/admin/usp/${id}`);
      toast.success('Đã xóa điểm nổi bật');
      fetchUsp();
    } catch {
      toast.error('Lỗi xóa điểm nổi bật');
    }
  };

  return (
    <AdminLayout title="Quản lý Điểm nổi bật (USP)">
      <div className="admin-panel-card">
        <div className="admin-panel-header">
          <div>
            <div className="admin-panel-title">🏅 5 Điểm nổi bật dưới Banner Hero</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
              Thay đổi biểu tượng (Icon/Ảnh), tiêu đề và mô tả phụ hiển thị trên thanh USP
            </div>
          </div>
          <button className="admin-action-btn save" onClick={openCreate}>
            <FiPlus /> Thêm điểm nổi bật
          </button>
        </div>

        <div className="admin-panel-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Icon / Ảnh</th>
                  <th>Tiêu đề chính</th>
                  <th>Mô tả phụ</th>
                  <th>Thứ tự</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid var(--color-accent-gold)',
                        }}
                      >
                        {item.iconUrl ? (
                          <img
                            src={item.iconUrl}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ color: '#fff', fontSize: '1.25rem' }}>🌿</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{item.title}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{item.subTitle || '—'}</td>
                    <td>{item.order}</td>
                    <td>
                      <span className={`admin-badge ${item.isActive ? 'active' : 'inactive'}`}>
                        {item.isActive ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="admin-action-btn edit" onClick={() => openEdit(item)}>
                          <FiEdit2 /> Sửa
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => handleDelete(item._id, item.title)}
                        >
                          <FiTrash2 /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">
                {editItem ? '✏️ Sửa điểm nổi bật' : '➕ Thêm điểm nổi bật'}
              </div>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              <ImageCropperField
                label="Icon / Hình ảnh tròn"
                preset="CIRCLE"
                currentUrl={croppedPreview}
                onCropped={(file, url) => {
                  setCroppedFile(file || null);
                  setCroppedPreview(url || '');
                }}
              />

              <div className="admin-form-grid" style={{ marginTop: '1.25rem' }}>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Tiêu đề chính *</label>
                  <input
                    className="admin-form-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Nguyên liệu thiên nhiên"
                  />
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Mô tả phụ</label>
                  <input
                    className="admin-form-input"
                    value={form.subTitle}
                    onChange={(e) => setForm({ ...form, subTitle: e.target.value })}
                    placeholder="Men lá rừng truyền thống"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    className="admin-form-input"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: +e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.2rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    <label className="admin-toggle">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      />
                      <span className="admin-toggle-slider" />
                    </label>
                    Hiển thị trên trang chủ
                  </label>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-action-btn"
                style={{
                  padding: '0.625rem 1.5rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid #e5e7eb',
                }}
                onClick={() => setModalOpen(false)}
              >
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


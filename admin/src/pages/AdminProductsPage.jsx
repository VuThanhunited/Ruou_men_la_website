import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import ImageCropperField from '../components/ImageCropperField';
import api from '../services/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: '', volume: '', description: '', price: '',
    isFeatured: false, isActive: true, order: 0,
  });
  const [croppedFile, setCroppedFile] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data.data);
    } catch { toast.error('Lỗi tải danh sách sản phẩm'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', volume: '', description: '', price: '', isFeatured: false, isActive: true, order: products.length + 1 });
    setCroppedFile(null);
    setCroppedPreview('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name, volume: item.volume || '', description: item.description || '',
      price: item.price || '', isFeatured: item.isFeatured, isActive: item.isActive, order: item.order,
    });
    setCroppedPreview(item.thumbnailUrl || '');
    setCroppedFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Vui lòng nhập tên sản phẩm');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (croppedFile) fd.append('thumbnailUrl', croppedFile);
      if (editItem) {
        await api.put(`/admin/products/${editItem._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('✅ Đã cập nhật sản phẩm');
      } else {
        await api.post('/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('✅ Đã thêm sản phẩm');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa sản phẩm "${name}"?`)) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Đã xóa sản phẩm');
      fetchProducts();
    } catch { toast.error('Lỗi xóa sản phẩm'); }
  };

  return (
    <AdminLayout title="Quản lý Sản phẩm">
      <div className="admin-panel-card">
        <div className="admin-panel-header">
          <div className="admin-panel-title">🏺 Danh sách sản phẩm</div>
          <button className="admin-action-btn save" onClick={openCreate}>
            <FiPlus /> Thêm sản phẩm
          </button>
        </div>
        <div className="admin-panel-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ảnh (1:1)</th><th>Tên sản phẩm</th><th>Dung tích</th>
                  <th>Giá</th><th>Nổi bật</th><th>Trạng thái</th><th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      {p.thumbnailUrl ? (
                        /* Luôn hiển thị vuông 1:1 bằng CSS */
                        <div style={{
                          width: 52, height: 52, borderRadius: 8, overflow: 'hidden',
                          border: '1px solid #e5e7eb', flexShrink: 0,
                        }}>
                          <img
                            src={p.thumbnailUrl}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </div>
                      ) : (
                        <div className="admin-table-img-placeholder">🏺</div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>{p.name}</td>
                    <td>{p.volume || '—'}</td>
                    <td>{p.price ? `${p.price.toLocaleString('vi-VN')}₫` : '—'}</td>
                    <td>
                      {p.isFeatured && <span className="admin-badge featured">★ Nổi bật</span>}
                    </td>
                    <td>
                      <span className={`admin-badge ${p.isActive ? 'active' : 'inactive'}`}>
                        {p.isActive ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="admin-action-btn edit" onClick={() => openEdit(p)}>
                          <FiEdit2 /> Sửa
                        </button>
                        <button className="admin-action-btn delete" onClick={() => handleDelete(p._id, p.name)}>
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

      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: 680 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="admin-modal-title">
                {editItem ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
              </div>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              {/* Image Cropper — 1:1 bắt buộc */}
              <ImageCropperField
                label="Ảnh sản phẩm"
                preset="SQUARE"
                currentUrl={croppedPreview}
                onCropped={(file, url) => {
                  setCroppedFile(file || null);
                  setCroppedPreview(url || '');
                }}
              />

              <div className="admin-form-grid" style={{ marginTop: '1.25rem' }}>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Tên sản phẩm *</label>
                  <input className="admin-form-input" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Dung tích / Quy cách</label>
                  <input className="admin-form-input" value={form.volume}
                    onChange={(e) => setForm({ ...form, volume: e.target.value })}
                    placeholder="500ml, 750ml, Hộp 2 chai..." />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Giá (VNĐ)</label>
                  <input type="number" className="admin-form-input" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Mô tả</label>
                  <textarea className="admin-form-textarea" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Thứ tự hiển thị</label>
                  <input type="number" className="admin-form-input" value={form.order}
                    onChange={(e) => setForm({ ...form, order: +e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '0.5rem 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <label className="admin-toggle">
                      <input type="checkbox" checked={form.isFeatured}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                      <span className="admin-toggle-slider" />
                    </label>
                    Nổi bật (Trang chủ)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <label className="admin-toggle">
                      <input type="checkbox" checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                      <span className="admin-toggle-slider" />
                    </label>
                    Hiển thị
                  </label>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-action-btn"
                style={{ padding: '0.625rem 1.5rem', borderRadius: 'var(--radius-full)', border: '1.5px solid #e5e7eb' }}
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


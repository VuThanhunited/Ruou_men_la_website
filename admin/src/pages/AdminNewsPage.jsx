import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import ImageCropperField from '../components/ImageCropperField';
import api from '../services/api';

export default function AdminNewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Văn Hóa Ẩm Thực',
    date: '',
    readTime: '3 phút đọc',
    excerpt: '',
    contentText: '',
    quote: '',
    order: 1,
    isActive: true,
  });
  const [croppedFile, setCroppedFile] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchNews = async () => {
    try {
      const res = await api.get('/admin/news');
      setArticles(res.data.data || []);
    } catch {
      toast.error('Lỗi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({
      title: '',
      category: 'Văn Hóa Ẩm Thực',
      date: new Date().toLocaleDateString('vi-VN'),
      readTime: '3 phút đọc',
      excerpt: '',
      contentText: '',
      quote: '',
      order: articles.length + 1,
      isActive: true,
    });
    setCroppedFile(null);
    setCroppedPreview('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title || '',
      category: item.category || 'Tin Tức HTX',
      date: item.date || '',
      readTime: item.readTime || '3 phút đọc',
      excerpt: item.excerpt || '',
      contentText: Array.isArray(item.content) ? item.content.join('\n\n') : item.content || '',
      quote: item.quote || '',
      order: item.order || 1,
      isActive: item.isActive !== false,
    });
    setCroppedFile(null);
    setCroppedPreview(item.imageUrl || '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Vui lòng nhập tiêu đề bài viết');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('date', form.date);
      fd.append('readTime', form.readTime);
      fd.append('excerpt', form.excerpt);
      fd.append('quote', form.quote);
      fd.append('order', form.order);
      fd.append('isActive', form.isActive);

      const paragraphs = form.contentText
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);
      fd.append('content', JSON.stringify(paragraphs));

      if (croppedFile) {
        fd.append('imageUrl', croppedFile);
      } else {
        fd.append('imageUrl', croppedPreview);
      }

      if (editItem) {
        await api.put(`/admin/news/${editItem._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✅ Đã cập nhật bài viết');
      } else {
        await api.post('/admin/news', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✅ Đã thêm bài viết mới');
      }
      setModalOpen(false);
      fetchNews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi lưu bài viết');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa bài viết "${title}"?`)) return;
    try {
      await api.delete(`/admin/news/${id}`);
      toast.success('Đã xóa bài viết');
      fetchNews();
    } catch {
      toast.error('Lỗi xóa bài viết');
    }
  };

  return (
    <AdminLayout title="Quản lý Tin tức & Văn hóa Men Lá">
      <div className="admin-panel-card">
        <div className="admin-panel-header">
          <div>
            <div className="admin-panel-title">📰 Danh sách Bài viết &amp; Tin tức</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
              Thay đổi hình ảnh bìa bài viết, nội dung cẩm nang và tin tức hoạt động HTX
            </div>
          </div>
          <button className="admin-action-btn save" onClick={openCreate}>
            <FiPlus /> Thêm bài viết
          </button>
        </div>

        <div className="admin-panel-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ảnh bìa</th>
                  <th>Tiêu đề bài viết</th>
                  <th>Chuyên mục</th>
                  <th>Ngày đăng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.imageUrl ? (
                        <div
                          style={{
                            width: 72,
                            height: 48,
                            borderRadius: 6,
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb',
                          }}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div className="admin-table-img-placeholder">📰</div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 320 }}>{item.title}</td>
                    <td>
                      <span className="admin-badge featured">{item.category}</span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      {item.date}
                    </td>
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
          <div className="admin-modal" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">
                {editItem ? '✏️ Chỉnh sửa bài viết' : '➕ Thêm bài viết mới'}
              </div>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              <ImageCropperField
                label="Ảnh bìa bài viết (16:9)"
                preset="BANNER_WIDE"
                currentUrl={croppedPreview}
                onCropped={(file, url) => {
                  setCroppedFile(file || null);
                  setCroppedPreview(url || '');
                }}
              />

              <div className="admin-form-grid" style={{ marginTop: '1.25rem' }}>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Tiêu đề bài viết *</label>
                  <input
                    className="admin-form-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Bí quyết tạo nên giọt rượu thơm từ hơn 20 loại thảo dược..."
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Chuyên mục</label>
                  <input
                    className="admin-form-input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Văn Hóa Ẩm Thực, Tin Tức HTX..."
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Ngày đăng &amp; Thời gian đọc</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      className="admin-form-input"
                      style={{ flex: 1 }}
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="24/10/2024"
                    />
                    <input
                      className="admin-form-input"
                      style={{ width: 130 }}
                      value={form.readTime}
                      onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                      placeholder="4 phút đọc"
                    />
                  </div>
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Mô tả tóm tắt (Hiện ngoài thẻ bài viết)</label>
                  <textarea
                    className="admin-form-textarea"
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  />
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">
                    Nội dung chi tiết (Mỗi đoạn cách nhau 1 dòng xuống hàng)
                  </label>
                  <textarea
                    className="admin-form-textarea"
                    rows={6}
                    value={form.contentText}
                    onChange={(e) => setForm({ ...form, contentText: e.target.value })}
                    placeholder="Nhập nội dung bài viết..."
                  />
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Câu trích dẫn nổi bật (Quote cuối bài)</label>
                  <input
                    className="admin-form-input"
                    value={form.quote}
                    onChange={(e) => setForm({ ...form, quote: e.target.value })}
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
                    Hiển thị bài viết
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
                <FiSave /> {saving ? 'Đang lưu...' : 'Lưu bài viết'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


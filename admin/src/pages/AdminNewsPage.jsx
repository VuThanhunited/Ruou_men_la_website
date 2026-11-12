import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiUpload, FiLink, FiImage } from 'react-icons/fi';
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
  const [galleryImages, setGalleryImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const galleryFileInputRef = useRef(null);

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
    setGalleryImages([]);
    setNewImageUrl('');
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
    setGalleryImages(Array.isArray(item.images) ? item.images.filter(Boolean) : []);
    setNewImageUrl('');
    setModalOpen(true);
  };

  // Thêm ảnh vào bài viết bằng URL
  const handleAddGalleryUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return toast.warning('Vui lòng nhập đường dẫn (URL) hình ảnh');
    setGalleryImages((prev) => [...prev, trimmed]);
    if (!croppedPreview && !croppedFile) {
      setCroppedPreview(trimmed);
    }
    setNewImageUrl('');
    toast.success('Đã thêm ảnh từ URL vào bài viết');
  };

  // Thêm ảnh vào bài viết bằng chọn file từ máy tính
  const handleSelectGalleryFiles = async (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;

    setUploadingGallery(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('images', f));
      const res = await api.post('/admin/news/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrls = res.data?.urls || (res.data?.url ? [res.data.url] : []);
      if (uploadedUrls.length) {
        setGalleryImages((prev) => [...prev, ...uploadedUrls]);
        if (!croppedPreview && !croppedFile) {
          setCroppedPreview(uploadedUrls[0]);
        }
        toast.success(`✅ Đã tải lên ${uploadedUrls.length} ảnh từ máy tính`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi tải ảnh từ máy tính');
    } finally {
      setUploadingGallery(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    }
  };

  const handleRemoveGalleryImage = (idx) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleInsertImageToContent = (imgUrl) => {
    setForm((prev) => ({
      ...prev,
      contentText: prev.contentText
        ? `${prev.contentText.trim()}\n\n[IMG:${imgUrl}]`
        : `[IMG:${imgUrl}]`,
    }));
    toast.info('Đã chèn ảnh vào nội dung bài viết');
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

      // Nếu người dùng vừa dán URL vào ô thêm ảnh nhưng chưa bấm nút "+ Thêm URL" thì tự động gom luôn
      const finalGallery = [...galleryImages];
      if (newImageUrl.trim() && !finalGallery.includes(newImageUrl.trim())) {
        finalGallery.push(newImageUrl.trim());
      }
      fd.append('images', JSON.stringify(finalGallery));

      if (croppedFile) {
        fd.append('imageUrl', croppedFile);
      } else {
        fd.append('imageUrl', croppedPreview || finalGallery[0] || '');
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
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                        onClick={() => openEdit(item)}
                        title="Bấm để đổi ảnh / chỉnh sửa"
                      >
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
                        {item.images?.length > 0 && (
                          <span
                            className="admin-badge"
                            style={{
                              fontSize: '0.7rem',
                              background: '#eef2ff',
                              color: '#3730a3',
                            }}
                          >
                            +{item.images.length} ảnh
                          </span>
                        )}
                      </div>
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
                          <FiEdit2 /> Sửa &amp; Thêm ảnh
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
          <div className="admin-modal" style={{ maxWidth: 760 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">
                {editItem ? '✏️ Chỉnh sửa bài viết & Hình ảnh' : '➕ Thêm bài viết mới'}
              </div>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              {/* 1. Ảnh bìa bài viết (Chọn từ máy tính hoặc nhập URL) */}
              <ImageCropperField
                label="1. Ảnh bìa bài viết (Chọn file từ máy tính hoặc dán URL)"
                preset="BANNER_WIDE"
                currentUrl={croppedPreview}
                onCropped={(file, url) => {
                  setCroppedFile(file || null);
                  setCroppedPreview(url || '');
                }}
              />

              <div style={{ marginTop: '0.65rem' }}>
                <label className="admin-form-label" style={{ fontSize: '0.78rem' }}>
                  🔗 Hoặc dán trực tiếp URL ảnh bìa tại đây:
                </label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={croppedPreview.startsWith('blob:') ? '' : croppedPreview}
                  onChange={(e) => {
                    setCroppedFile(null);
                    setCroppedPreview(e.target.value);
                  }}
                  placeholder="https://... hoặc /assets/..."
                />
              </div>

              {/* 2. Hình ảnh trong bài viết (Thêm nhiều ảnh bằng URL hoặc File từ máy tính) */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  borderRadius: 10,
                  border: '1.5px dashed #d1d5db',
                  background: '#fafaf9',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-dark)' }}>
                      🖼️ 2. Hình ảnh trong nội dung bài viết ({galleryImages.length} ảnh)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Thêm ảnh minh họa, giấy phép hoặc tài liệu vào bài viết bằng file từ máy tính hoặc đường dẫn URL
                    </div>
                  </div>

                  {/* Nút chọn file ảnh từ máy tính */}
                  <button
                    type="button"
                    className="admin-action-btn save"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                    onClick={() => galleryFileInputRef.current?.click()}
                    disabled={uploadingGallery}
                  >
                    <FiUpload /> {uploadingGallery ? 'Đang tải ảnh...' : 'Chọn ảnh từ máy tính'}
                  </button>
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    multiple
                    onChange={handleSelectGalleryFiles}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Ô thêm ảnh bằng URL */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: galleryImages.length ? '0.85rem' : 0 }}>
                  <input
                    type="text"
                    className="admin-form-input"
                    style={{ flex: 1 }}
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddGalleryUrl();
                      }
                    }}
                    placeholder="Dán link ảnh (https://...) rồi bấm Thêm ảnh URL"
                  />
                  <button
                    type="button"
                    className="admin-action-btn edit"
                    onClick={handleAddGalleryUrl}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <FiLink /> + Thêm ảnh URL
                  </button>
                </div>

                {/* Danh sách ảnh đã thêm vào bài viết */}
                {galleryImages.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                      gap: '0.75rem',
                    }}
                  >
                    {galleryImages.map((imgUrl, idx) => (
                      <div
                        key={`${imgUrl}-${idx}`}
                        style={{
                          background: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: 8,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div style={{ height: 100, background: '#f3f4f6', position: 'relative' }}>
                          <img
                            src={imgUrl}
                            alt={`Ảnh bài viết ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            title="Xóa ảnh này"
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              border: 'none',
                              background: 'rgba(220,38,38,0.9)',
                              color: '#fff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <FiX size={13} />
                          </button>
                        </div>
                        <div
                          style={{
                            padding: '0.35rem',
                            display: 'flex',
                            gap: '0.25rem',
                            justifyContent: 'space-between',
                            background: '#f9fafb',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setCroppedFile(null);
                              setCroppedPreview(imgUrl);
                              toast.info('Đã đặt làm ảnh bìa bài viết');
                            }}
                            style={{
                              flex: 1,
                              fontSize: '0.68rem',
                              padding: '0.25rem 0.3rem',
                              borderRadius: 4,
                              border: '1px solid #d1d5db',
                              background: '#fff',
                              cursor: 'pointer',
                            }}
                          >
                            Làm ảnh bìa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInsertImageToContent(imgUrl)}
                            style={{
                              flex: 1,
                              fontSize: '0.68rem',
                              padding: '0.25rem 0.3rem',
                              borderRadius: 4,
                              border: '1px solid #d1d5db',
                              background: '#fff',
                              cursor: 'pointer',
                            }}
                          >
                            Chèn vào bài
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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


import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import ImageCropperField from '../components/ImageCropperField';
import api from '../services/api';

export default function AdminProcessPage() {
  const [section, setSection] = useState({
    sectionTitle: '',
    sectionSubtitle: '',
    sectionDescription: '',
    buttonText: '',
    buttonLink: '',
  });
  const [decorFile, setDecorFile] = useState(null);
  const [decorPreview, setDecorPreview] = useState('');
  const [steps, setSteps] = useState([]);
  const [savingSection, setSavingSection] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editStep, setEditStep] = useState(null);
  const [stepForm, setStepForm] = useState({
    stepNumber: 1,
    title: '',
    subtitle: '',
    detailTitle: '',
    lead: '',
    detailsText: '',
    secret: '',
    isActive: true,
  });
  const [stepCroppedFile, setStepCroppedFile] = useState(null);
  const [stepCroppedPreview, setStepCroppedPreview] = useState('');
  const [savingStep, setSavingStep] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get('/process');
      const s = res.data.data?.section;
      if (s) {
        setSection({
          sectionTitle: s.sectionTitle || '',
          sectionSubtitle: s.sectionSubtitle || '',
          sectionDescription: s.sectionDescription || '',
          buttonText: s.buttonText || '',
          buttonLink: s.buttonLink || '',
        });
        setDecorPreview(s.decorBgUrl || '');
      }
      const stepsRes = await api.get('/admin/process/steps');
      setSteps(stepsRes.data.data || []);
    } catch {
      toast.error('Lỗi tải dữ liệu');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveSection = async (e) => {
    e.preventDefault();
    setSavingSection(true);
    try {
      const fd = new FormData();
      Object.entries(section).forEach(([k, v]) => fd.append(k, v));
      if (decorFile) {
        fd.append('decorBgUrl', decorFile);
      } else {
        fd.append('decorBgUrl', decorPreview);
      }
      await api.put('/admin/process/section', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('✅ Lưu nội dung Section Quy trình thành công');
    } catch {
      toast.error('Lỗi lưu section');
    } finally {
      setSavingSection(false);
    }
  };

  const openCreateStep = () => {
    setEditStep(null);
    setStepForm({
      stepNumber: steps.length + 1,
      title: '',
      subtitle: '',
      detailTitle: '',
      lead: '',
      detailsText: '',
      secret: '',
      isActive: true,
    });
    setStepCroppedFile(null);
    setStepCroppedPreview('');
    setModalOpen(true);
  };

  const openEditStep = (step) => {
    setEditStep(step);
    setStepForm({
      stepNumber: step.stepNumber,
      title: step.title || '',
      subtitle: step.subtitle || '',
      detailTitle: step.detailTitle || step.title || '',
      lead: step.lead || '',
      detailsText: Array.isArray(step.details) ? step.details.join('\n') : '',
      secret: step.secret || '',
      isActive: step.isActive !== false,
    });
    setStepCroppedPreview(step.imageUrl || '');
    setStepCroppedFile(null);
    setModalOpen(true);
  };

  const saveStep = async () => {
    if (!stepForm.title.trim()) return toast.error('Vui lòng nhập tên bước');
    setSavingStep(true);
    try {
      const fd = new FormData();
      fd.append('stepNumber', stepForm.stepNumber);
      fd.append('title', stepForm.title);
      fd.append('subtitle', stepForm.subtitle);
      fd.append('detailTitle', stepForm.detailTitle);
      fd.append('lead', stepForm.lead);
      fd.append('secret', stepForm.secret);
      fd.append('isActive', stepForm.isActive);
      const detailsArr = stepForm.detailsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      fd.append('details', JSON.stringify(detailsArr));

      if (stepCroppedFile) {
        fd.append('imageUrl', stepCroppedFile);
      } else {
        fd.append('imageUrl', stepCroppedPreview);
      }

      if (editStep) {
        await api.put(`/admin/process/steps/${editStep._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✅ Đã cập nhật bước quy trình');
      } else {
        await api.post('/admin/process/steps', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✅ Đã thêm bước quy trình mới');
      }
      setModalOpen(false);
      fetchData();
    } catch {
      toast.error('Lỗi lưu bước quy trình');
    } finally {
      setSavingStep(false);
    }
  };

  const deleteStep = async (id, title) => {
    if (!window.confirm(`Xóa bước "${title}"?`)) return;
    await api.delete(`/admin/process/steps/${id}`);
    toast.success('Đã xóa');
    fetchData();
  };

  return (
    <AdminLayout title="Quy trình Sản xuất">
      {/* Section Text & Background */}
      <div className="admin-panel-card">
        <div className="admin-panel-header">
          <div className="admin-panel-title">📝 Nội dung &amp; Ảnh nền Section Quy trình</div>
        </div>
        <div className="admin-panel-body">
          <form onSubmit={saveSection}>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-form-label">Tiêu đề section (In hoa)</label>
                <input
                  className="admin-form-input"
                  value={section.sectionTitle}
                  onChange={(e) => setSection({ ...section, sectionTitle: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Subtitle (Font Script)</label>
                <input
                  className="admin-form-input"
                  value={section.sectionSubtitle}
                  onChange={(e) => setSection({ ...section, sectionSubtitle: e.target.value })}
                />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">Mô tả chung</label>
                <textarea
                  className="admin-form-textarea"
                  value={section.sectionDescription}
                  onChange={(e) => setSection({ ...section, sectionDescription: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Text nút CTA</label>
                <input
                  className="admin-form-input"
                  value={section.buttonText}
                  onChange={(e) => setSection({ ...section, buttonText: e.target.value })}
                  placeholder="XEM CHI TIẾT QUY TRÌNH"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Link nút CTA</label>
                <input
                  className="admin-form-input"
                  value={section.buttonLink}
                  onChange={(e) => setSection({ ...section, buttonLink: e.target.value })}
                  placeholder="#quy-trinh"
                />
              </div>
              <div className="admin-form-group full-width">
                <ImageCropperField
                  label="Ảnh nền trang trí khu vực Quy trình (Tùy chọn)"
                  preset="BANNER_WIDE"
                  currentUrl={decorPreview}
                  onCropped={(file, url) => {
                    setDecorFile(file || null);
                    setDecorPreview(url || '');
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="admin-action-btn save" disabled={savingSection}>
                <FiSave /> {savingSection ? 'Đang lưu...' : 'Lưu section'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Steps Table */}
      <div className="admin-panel-card">
        <div className="admin-panel-header">
          <div>
            <div className="admin-panel-title">⚙️ Các bước sản xuất (Hiện trên trang chủ &amp; Popup chi tiết)</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
              Khi đổi ảnh hoặc nội dung bước tại đây, cả vòng tròn ngoài trang chủ lẫn Popup Chi tiết 4 bước đều tự động cập nhật
            </div>
          </div>
          <button className="admin-action-btn save" onClick={openCreateStep}>
            <FiPlus /> Thêm bước
          </button>
        </div>
        <div className="admin-panel-body" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh tròn (1:1)</th>
                <th>Số bước</th>
                <th>Tên bước</th>
                <th>Mô tả phụ</th>
                <th>Hiển thị</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step) => (
                <tr key={step._id}>
                  <td>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid var(--color-accent-gold)',
                        background: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.imageUrl ? (
                        <img
                          src={step.imageUrl}
                          alt={step.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ fontSize: '1.25rem' }}>🌿</span>
                      )}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                    {step.stepNumber}
                  </td>
                  <td style={{ fontWeight: 600 }}>{step.title}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                    {step.subtitle}
                  </td>
                  <td>
                    <span className={`admin-badge ${step.isActive ? 'active' : 'inactive'}`}>
                      {step.isActive ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="admin-action-btn edit" onClick={() => openEditStep(step)}>
                        <FiEdit2 /> Sửa &amp; Đổi ảnh
                      </button>
                      <button
                        className="admin-action-btn delete"
                        onClick={() => deleteStep(step._id, step.title)}
                      >
                        <FiTrash2 /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">
                {editStep ? `✏️ Sửa Bước ${stepForm.stepNumber}` : '➕ Thêm bước quy trình mới'}
              </div>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              <ImageCropperField
                label="Ảnh bước quy trình (Hiển thị ở vòng tròn trang chủ & trong Popup)"
                preset="CIRCLE"
                currentUrl={stepCroppedPreview}
                onCropped={(file, url) => {
                  setStepCroppedFile(file || null);
                  setStepCroppedPreview(url || '');
                }}
              />
              <div className="admin-form-grid" style={{ marginTop: '1.25rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Thứ tự bước</label>
                  <input
                    type="number"
                    className="admin-form-input"
                    value={stepForm.stepNumber}
                    onChange={(e) => setStepForm({ ...stepForm, stepNumber: +e.target.value })}
                    min={1}
                    max={10}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Tên bước ngắn gọn (Ngoài trang chủ) *</label>
                  <input
                    className="admin-form-input"
                    value={stepForm.title}
                    onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                    placeholder="Chọn nguyên liệu"
                  />
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Mô tả phụ ngắn</label>
                  <input
                    className="admin-form-input"
                    value={stepForm.subtitle}
                    onChange={(e) => setStepForm({ ...stepForm, subtitle: e.target.value })}
                    placeholder="Gạo nếp, men lá rừng"
                  />
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Tiêu đề đầy đủ trong Popup chi tiết</label>
                  <input
                    className="admin-form-input"
                    value={stepForm.detailTitle}
                    onChange={(e) => setStepForm({ ...stepForm, detailTitle: e.target.value })}
                    placeholder="Tuyển Chọn Gạo Nếp & Thảo Dược Vùng Cao"
                  />
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Câu dẫn nhập trong Popup (Lead)</label>
                  <textarea
                    className="admin-form-textarea"
                    rows={2}
                    value={stepForm.lead}
                    onChange={(e) => setStepForm({ ...stepForm, lead: e.target.value })}
                  />
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">
                    Các khâu thực hiện chi tiết (Mỗi gạch đầu dòng 1 dòng)
                  </label>
                  <textarea
                    className="admin-form-textarea"
                    rows={4}
                    value={stepForm.detailsText}
                    onChange={(e) => setStepForm({ ...stepForm, detailsText: e.target.value })}
                  />
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Bí quyết Yến Nhi (Hộp nổi bật trong Popup)</label>
                  <textarea
                    className="admin-form-textarea"
                    rows={2}
                    value={stepForm.secret}
                    onChange={(e) => setStepForm({ ...stepForm, secret: e.target.value })}
                  />
                </div>
                <div>
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
                        checked={stepForm.isActive}
                        onChange={(e) => setStepForm({ ...stepForm, isActive: e.target.checked })}
                      />
                      <span className="admin-toggle-slider" />
                    </label>
                    Hiển thị bước này
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
              <button className="admin-action-btn save" onClick={saveStep} disabled={savingStep}>
                <FiSave /> {savingStep ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

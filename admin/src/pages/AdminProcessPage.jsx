import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import ImageCropperField from '../components/ImageCropperField';
import api from '../services/api';

export default function AdminProcessPage() {
  const [section, setSection] = useState({
    sectionTitle: '', sectionSubtitle: '', sectionDescription: '', buttonText: '', buttonLink: '',
  });
  const [steps, setSteps] = useState([]);
  const [loadingSection, setLoadingSection] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStep, setEditStep] = useState(null);
  const [stepForm, setStepForm] = useState({ stepNumber: 1, title: '', subtitle: '', isActive: true });
  const [stepCroppedFile, setStepCroppedFile] = useState(null);
  const [stepCroppedPreview, setStepCroppedPreview] = useState('');
  const [savingStep, setSavingStep] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get('/process');
      const s = res.data.data.section;
      if (s) {
        setSection({
          sectionTitle: s.sectionTitle || '', sectionSubtitle: s.sectionSubtitle || '',
          sectionDescription: s.sectionDescription || '', buttonText: s.buttonText || '',
          buttonLink: s.buttonLink || '',
        });
      }
      const stepsRes = await api.get('/admin/process/steps');
      setSteps(stepsRes.data.data);
    } catch { toast.error('Lỗi tải dữ liệu'); }
    finally { setLoadingSection(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const saveSection = async (e) => {
    e.preventDefault();
    setSavingSection(true);
    try {
      const fd = new FormData();
      Object.entries(section).forEach(([k, v]) => fd.append(k, v));
      await api.put('/admin/process/section', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('✅ Lưu section thành công');
    } catch { toast.error('Lỗi lưu'); }
    finally { setSavingSection(false); }
  };

  const openCreateStep = () => {
    setEditStep(null);
    setStepForm({ stepNumber: steps.length + 1, title: '', subtitle: '', isActive: true });
    setStepCroppedFile(null); setStepCroppedPreview('');
    setModalOpen(true);
  };

  const openEditStep = (step) => {
    setEditStep(step);
    setStepForm({ stepNumber: step.stepNumber, title: step.title, subtitle: step.subtitle || '', isActive: step.isActive });
    setStepCroppedPreview(step.imageUrl || ''); setStepCroppedFile(null);
    setModalOpen(true);
  };

  const saveStep = async () => {
    if (!stepForm.title.trim()) return toast.error('Nhập tên bước');
    setSavingStep(true);
    try {
      const fd = new FormData();
      Object.entries(stepForm).forEach(([k, v]) => fd.append(k, v));
      if (stepCroppedFile) fd.append('imageUrl', stepCroppedFile);
      if (editStep) {
        await api.put(`/admin/process/steps/${editStep._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('✅ Cập nhật bước');
      } else {
        await api.post('/admin/process/steps', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('✅ Thêm bước mới');
      }
      setModalOpen(false); fetchData();
    } catch { toast.error('Lỗi'); }
    finally { setSavingStep(false); }
  };

  const deleteStep = async (id, title) => {
    if (!window.confirm(`Xóa bước "${title}"?`)) return;
    await api.delete(`/admin/process/steps/${id}`);
    toast.success('Đã xóa'); fetchData();
  };

  return (
    <AdminLayout title="Quy trình Sản xuất">
      {/* Section Text */}
      <div className="admin-panel-card">
        <div className="admin-panel-header"><div className="admin-panel-title">📝 Nội dung Section</div></div>
        <div className="admin-panel-body">
          <form onSubmit={saveSection}>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-form-label">Tiêu đề section (In hoa)</label>
                <input className="admin-form-input" value={section.sectionTitle}
                  onChange={(e) => setSection({ ...section, sectionTitle: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Subtitle (Font Script)</label>
                <input className="admin-form-input" value={section.sectionSubtitle}
                  onChange={(e) => setSection({ ...section, sectionSubtitle: e.target.value })} />
              </div>
              <div className="admin-form-group full-width">
                <label className="admin-form-label">Mô tả</label>
                <textarea className="admin-form-textarea" value={section.sectionDescription}
                  onChange={(e) => setSection({ ...section, sectionDescription: e.target.value })} rows={3} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Text nút CTA</label>
                <input className="admin-form-input" value={section.buttonText}
                  onChange={(e) => setSection({ ...section, buttonText: e.target.value })}
                  placeholder="XEM CHI TIẾT QUY TRÌNH" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Link nút CTA</label>
                <input className="admin-form-input" value={section.buttonLink}
                  onChange={(e) => setSection({ ...section, buttonLink: e.target.value })}
                  placeholder="/quy-trinh" />
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
          <div className="admin-panel-title">⚙️ Các bước sản xuất</div>
          <button className="admin-action-btn save" onClick={openCreateStep}><FiPlus /> Thêm bước</button>
        </div>
        <div className="admin-panel-body" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr><th>Ảnh tròn (1:1)</th><th>Số bước</th><th>Tên bước</th><th>Mô tả phụ</th><th>Hiển thị</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {steps.map((step) => (
                <tr key={step._id}>
                  <td>
                    {/* Luôn render tròn bằng CSS — border-radius 50% */}
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', overflow: 'hidden',
                      border: '2px solid var(--color-accent-gold)', background: 'var(--color-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {step.imageUrl
                        ? <img src={step.imageUrl} alt={step.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '1.25rem' }}>🌿</span>
                      }
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>{step.stepNumber}</td>
                  <td style={{ fontWeight: 600 }}>{step.title}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{step.subtitle}</td>
                  <td><span className={`admin-badge ${step.isActive ? 'active' : 'inactive'}`}>{step.isActive ? 'Hiển thị' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="admin-action-btn edit" onClick={() => openEditStep(step)}><FiEdit2 /> Sửa</button>
                      <button className="admin-action-btn delete" onClick={() => deleteStep(step._id, step.title)}><FiTrash2 /> Xóa</button>
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
          <div className="admin-modal" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">{editStep ? '✏️ Sửa bước' : '➕ Thêm bước mới'}</div>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}><FiX /></button>
            </div>
            <div className="admin-modal-body">
              {/* Process step image — CIRCLE crop 1:1 */}
              <ImageCropperField
                label="Ảnh bước quy trình"
                preset="CIRCLE"
                currentUrl={stepCroppedPreview}
                onCropped={(file, url) => {
                  setStepCroppedFile(file || null);
                  setStepCroppedPreview(url || '');
                }}
              />
              <div className="admin-form-grid" style={{ marginTop: '1.25rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Số bước</label>
                  <input type="number" className="admin-form-input" value={stepForm.stepNumber}
                    onChange={(e) => setStepForm({ ...stepForm, stepNumber: +e.target.value })} min={1} max={10} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Tên bước *</label>
                  <input className="admin-form-input" value={stepForm.title}
                    onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                    placeholder="Chọn nguyên liệu" />
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-form-label">Mô tả phụ</label>
                  <input className="admin-form-input" value={stepForm.subtitle}
                    onChange={(e) => setStepForm({ ...stepForm, subtitle: e.target.value })}
                    placeholder="Gạo nếp, men lá rừng" />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <label className="admin-toggle">
                      <input type="checkbox" checked={stepForm.isActive}
                        onChange={(e) => setStepForm({ ...stepForm, isActive: e.target.checked })} />
                      <span className="admin-toggle-slider" />
                    </label>
                    Hiển thị
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


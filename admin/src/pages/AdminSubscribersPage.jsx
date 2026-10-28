import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiDownload, FiMail } from 'react-icons/fi';
import AdminLayout from './AdminLayout';
import api from '../services/api';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/subscribers')
      .then((res) => setSubscribers(res.data.data))
      .catch(() => toast.error('Lỗi tải danh sách'))
      .finally(() => setLoading(false));
  }, []);

  const exportCSV = () => {
    const rows = ['Email,Ngày đăng ký', ...subscribers.map((s) => `${s.email},${new Date(s.createdAt).toLocaleDateString('vi-VN')}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout title="Danh sách Subscribers">
      <div className="admin-panel-card">
        <div className="admin-panel-header">
          <div className="admin-panel-title"><FiMail style={{ marginRight: 8 }} /> Danh sách đăng ký nhận tin ({subscribers.length})</div>
          <button className="admin-action-btn edit" onClick={exportCSV}>
            <FiDownload /> Xuất CSV
          </button>
        </div>
        <div className="admin-panel-body" style={{ padding: 0 }}>
          {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div> : (
            <table className="admin-table">
              <thead><tr><th>#</th><th>Email</th><th>Ngày đăng ký</th><th>Trạng thái</th></tr></thead>
              <tbody>
                {subscribers.map((sub, idx) => (
                  <tr key={sub._id}>
                    <td style={{ color: 'var(--color-text-muted)' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 500 }}>{sub.email}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                      {new Date(sub.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td><span className={`admin-badge ${sub.isActive ? 'active' : 'inactive'}`}>{sub.isActive ? 'Hoạt động' : 'Dừng'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


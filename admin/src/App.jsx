import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminThemePage from './pages/AdminThemePage';
import AdminHeroPage from './pages/AdminHeroPage';
import AdminUspPage from './pages/AdminUspPage';
import AdminIntroPage from './pages/AdminIntroPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminProcessPage from './pages/AdminProcessPage';
import AdminBrandStoryPage from './pages/AdminBrandStoryPage';
import AdminNewsPage from './pages/AdminNewsPage';
import AdminTestimonialsPage from './pages/AdminTestimonialsPage';
import AdminSiteConfigPage from './pages/AdminSiteConfigPage';
import AdminSubscribersPage from './pages/AdminSubscribersPage';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />

        {/* Redirect gốc về dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

        {/* Protected admin routes */}
        <Route path="/dashboard"    element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/theme"        element={<ProtectedRoute><AdminThemePage /></ProtectedRoute>} />
        <Route path="/hero"         element={<ProtectedRoute><AdminHeroPage /></ProtectedRoute>} />
        <Route path="/usp"          element={<ProtectedRoute><AdminUspPage /></ProtectedRoute>} />
        <Route path="/intro"        element={<ProtectedRoute><AdminIntroPage /></ProtectedRoute>} />
        <Route path="/products"     element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
        <Route path="/process"      element={<ProtectedRoute><AdminProcessPage /></ProtectedRoute>} />
        <Route path="/brand-story"  element={<ProtectedRoute><AdminBrandStoryPage /></ProtectedRoute>} />
        <Route path="/news"         element={<ProtectedRoute><AdminNewsPage /></ProtectedRoute>} />
        <Route path="/testimonials" element={<ProtectedRoute><AdminTestimonialsPage /></ProtectedRoute>} />
        <Route path="/site-config"  element={<ProtectedRoute><AdminSiteConfigPage /></ProtectedRoute>} />
        <Route path="/subscribers"  element={<ProtectedRoute><AdminSubscribersPage /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

// Landing Page only — Admin đã tách ra folder /admin riêng
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Các route khác của landing page sẽ thêm vào đây nếu cần */}
      </Routes>
    </BrowserRouter>
  );
}

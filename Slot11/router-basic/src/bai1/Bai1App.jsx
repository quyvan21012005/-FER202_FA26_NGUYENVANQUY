import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import HomePage from './pages/HomePage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import About from './components/About';

const Bai1App = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar xuất hiện ở mọi trang, đặt ngoài Routes */}
      <AppNavbar />

      {/* Nội dung chính của từng trang */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer chung */}
      <footer className="bg-dark text-white text-center py-3 mt-auto border-top">
        <div className="container">
          <small>© 2026 Văn Quý – Portfolio Cá Nhân. Thực hành React Router Bài 1.</small>
        </div>
      </footer>
    </div>
  );
};

export default Bai1App;

import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HelpLayout from './layouts/HelpLayout';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import FaqPage from './pages/FaqPage';
import RulesPage from './pages/RulesPage';
import NotFoundPage from './pages/NotFoundPage';

const Bai2App = () => {
  return (
    <Routes>
      {/* Route cha MainLayout: navbar và footer dùng chung cho toàn bộ app */}
      <Route path="/" element={<MainLayout />}>
        {/* Route index: hiển thị khi URL đúng bằng "/" */}
        <Route index element={<HomePage />} />

        {/* Route tương đối: path="books" tương ứng với "/books" */}
        <Route path="books" element={<BooksPage />} />

        {/* Route lồng 2 cấp: path="help" bọc bởi HelpLayout */}
        <Route path="help" element={<HelpLayout />}>
          {/* Vào /help thì tự chuyển sang /help/faq với replace để không kẹt lịch sử */}
          <Route index element={<Navigate to="faq" replace />} />
          {/* Route tương đối "faq" -> /help/faq */}
          <Route path="faq" element={<FaqPage />} />
          {/* Route tương đối "rules" -> /help/rules */}
          <Route path="rules" element={<RulesPage />} />
        </Route>

        {/* Trang 404 nằm trong MainLayout nên vẫn có Navbar và Footer */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default Bai2App;

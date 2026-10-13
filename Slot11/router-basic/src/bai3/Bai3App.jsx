import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import CourseListPage from './pages/CourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';

const Bai3App = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar bg="dark" variant="dark" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/courses" className="fw-bold">
            FPT Course Manager – Bài 3 (useParams)
          </Navbar.Brand>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:code" element={<CourseDetailPage />} />
          <Route
            path="*"
            element={
              <Container className="py-5 text-center">
                <h2 className="text-danger fw-bold">404 - Trang không tồn tại</h2>
                <p className="text-muted">Đường dẫn bạn yêu cầu không tồn tại.</p>
                <Link to="/courses" className="btn btn-primary">
                  Về danh sách môn học
                </Link>
              </Container>
            }
          />
        </Routes>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-auto border-top">
        <div className="container">
          <small>© 2026 Văn Quý – Bài 3: Tham số động với useParams. FPT University.</small>
        </div>
      </footer>
    </div>
  );
};

export default Bai3App;

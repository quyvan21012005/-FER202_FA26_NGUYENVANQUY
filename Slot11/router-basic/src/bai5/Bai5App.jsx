import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import StudentListPage from './pages/StudentListPage';

const Bai5App = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar bg="dark" variant="dark" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2">
            <span>🎓</span>
            <span>FPT Student Directory – Bài 5 (useSearchParams)</span>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<StudentListPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-auto border-top">
        <Container>
          <small>© 2026 FPT University – Danh bạ sinh viên. Thực hành React Router Bài 5 (useSearchParams).</small>
        </Container>
      </footer>
    </div>
  );
};

export default Bai5App;

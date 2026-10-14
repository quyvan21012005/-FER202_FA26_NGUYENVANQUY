import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import EventPage from './pages/EventPage';
import RegisterPage from './pages/RegisterPage';
import SuccessPage from './pages/SuccessPage';

const Bai4App = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2">
            <span>🎟️</span>
            <span>FPTU Tech Day 2026 – Bài 4 (useNavigate & State)</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="event-navbar" />
          <Navbar.Collapse id="event-navbar">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Trang sự kiện
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                Đăng ký vé
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container as="main" className="flex-grow-1">
        <Routes>
          <Route path="/" element={<EventPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>

      <footer className="bg-dark text-white text-center py-3 mt-auto border-top">
        <Container>
          <small>© 2026 FPT University – FPTU Tech Day. Thực hành React Router Bài 4.</small>
        </Container>
      </footer>
    </div>
  );
};

export default Bai4App;

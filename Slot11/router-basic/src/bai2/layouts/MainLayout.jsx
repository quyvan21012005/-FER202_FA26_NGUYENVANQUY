import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, NavLink, Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2">
            <span>📚</span>
            <span>Thư viện FPT University</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/" end>
                Trang chủ
              </Nav.Link>
              <Nav.Link as={NavLink} to="/books">
                Sách
              </Nav.Link>
              {/* Lưu ý: 'to="/help"' KHÔNG dùng 'end' để menu luôn active khi ở /help/faq hay /help/rules */}
              <Nav.Link as={NavLink} to="/help">
                Hướng dẫn
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container as="main" className="my-4 flex-grow-1">
        <Outlet />
      </Container>

      <footer className="bg-dark text-white text-center py-3 mt-auto border-top">
        <Container>
          <small>© 2026 Thư viện FPT University. Thực hành React Router Bài 2 - FPT University.</small>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout;

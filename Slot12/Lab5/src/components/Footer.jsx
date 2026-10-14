import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row className="gy-3">
          {/* Cột 1: Thông tin giới thiệu */}
          <Col md={4}>
            <h5 className="text-uppercase fw-bold text-primary">Lab5 Website</h5>
            <p className="small text-secondary">
              Website thực hành Lab5 sử dụng React, React Router và React Bootstrap.
            </p>
          </Col>

          {/* Cột 2: Điều hướng nhanh */}
          <Col md={4}>
            <h5 className="text-uppercase fw-bold">Liên kết nhanh</h5>
            <ul className="list-unstyled small">
              <li>
                <Link to="/" className="text-secondary text-decoration-none">Trang chủ (Home)</Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary text-decoration-none">Giới thiệu (About)</Link>
              </li>
              <li>
                <Link to="/new" className="text-secondary text-decoration-none">Tin tức (New)</Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary text-decoration-none">Liên hệ (Contact)</Link>
              </li>
            </ul>
          </Col>

          {/* Cột 3: Thông tin liên hệ / bản quyền */}
          <Col md={4}>
            <h5 className="text-uppercase fw-bold">Thông tin liên hệ</h5>
            <p className="small text-secondary mb-1">Email: contact@lab5.edu.vn</p>
            <p className="small text-secondary mb-1">Hotline: 0123 456 789</p>
            <p className="small text-secondary">Địa chỉ: FPT University</p>
          </Col>
        </Row>

        <hr className="border-secondary my-3" />

        <Row>
          <Col className="text-center text-secondary small">
            &copy; {new Date().getFullYear()} Lab5 Project. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
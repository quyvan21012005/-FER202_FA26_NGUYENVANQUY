import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EventPage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    // Điều hướng bằng code thông qua useNavigate
    navigate('/register');
  };

  return (
    <div className="py-4">
      {/* Hero Card */}
      <Card className="border-0 shadow-sm p-4 p-md-5 mb-4 bg-white text-center rounded-4">
        <Card.Body>
          <div className="mb-3">
            <Badge bg="danger" className="px-3 py-2 fs-6 rounded-pill">
              🔥 Sự Kiện Công Nghệ Lớn Nhất Năm 2026
            </Badge>
          </div>
          <h1 className="fw-bold display-4 mb-3 text-dark">FPTU Tech Day 2026</h1>
          <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: '720px' }}>
            Khám phá kỷ nguyên AI tạo sinh, React 19 hiện đại, Cloud Native và kiến trúc phần mềm thế hệ mới 
            cùng các chuyên gia công nghệ hàng đầu tại FPT University.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
            <div className="border rounded-3 px-3 py-2 bg-light text-start">
              <small className="text-muted d-block">📅 Thời gian</small>
              <strong className="text-dark">Thứ Bảy, 25/10/2026</strong>
            </div>
            <div className="border rounded-3 px-3 py-2 bg-light text-start">
              <small className="text-muted d-block">📍 Địa điểm</small>
              <strong className="text-dark">Hội trường B - FPT University</strong>
            </div>
            <div className="border rounded-3 px-3 py-2 bg-light text-start">
              <small className="text-muted d-block">🎟️ Vé vào cổng</small>
              <strong className="text-success">Hoàn toàn Miễn phí</strong>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="px-5 py-3 fw-bold rounded-pill shadow"
            onClick={handleRegisterClick}
          >
            🚀 Đăng ký tham gia ngay
          </Button>
        </Card.Body>
      </Card>

      {/* Thông tin 2 buổi tham gia */}
      <h3 className="fw-bold mb-3 text-center">Nội Dung 2 Buổi Hội Thảo</h3>
      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm rounded-3">
            <Card.Header className="bg-primary text-white py-3 fw-bold">
              ☀️ Buổi Sáng: 08:00 - 11:30
            </Card.Header>
            <Card.Body className="p-4">
              <h5 className="fw-bold text-primary mb-3">AI & Frontend Engineering thế hệ mới</h5>
              <ul className="text-muted mb-0 lh-lg">
                <li>Keynote: Xu hướng Trí tuệ nhân tạo tạo sinh trong phát triển phần mềm.</li>
                <li>React 19 & React Router 7: Các tính năng đột phá và thực tiễn triển khai.</li>
                <li>Hỏi đáp trực tiếp (Q&A) cùng diễn giả và nhận quà công nghệ.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm rounded-3">
            <Card.Header className="bg-success text-white py-3 fw-bold">
              ⛅ Buổi Chiều: 13:30 - 17:00
            </Card.Header>
            <Card.Body className="p-4">
              <h5 className="fw-bold text-success mb-3">Cloud Architecture & Career Coaching</h5>
              <ul className="text-muted mb-0 lh-lg">
                <li>Xây dựng hệ thống High Availability trên nền tảng Cloud Native.</li>
                <li>Networking & Tuyển dụng: Giao lưu cùng các Tech Lead từ tập đoàn FPT.</li>
                <li>Vinh danh và bốc thăm may mắn giải thưởng công nghệ đặc biệt.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EventPage;

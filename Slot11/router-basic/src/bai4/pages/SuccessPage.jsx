import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Đọc dữ liệu được truyền qua location.state
  const data = location.state;

  // Nếu người dùng gõ thẳng URL /success trên thanh địa chỉ (không submit qua form)
  // thì location.state sẽ là null/undefined -> Chặn truy cập và tự động chuyển về /register
  // Lưu ý: Tuyệt đối không gọi navigate() trong thân render, phải return <Navigate />
  if (!data) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm rounded-4 text-center p-4 p-md-5 bg-white">
            <Card.Body>
              <div className="mb-3">
                <span
                  className="d-inline-flex justify-content-center align-items-center bg-success-subtle text-success rounded-circle"
                  style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}
                >
                  ✓
                </span>
              </div>

              <h2 className="fw-bold text-success mb-2">Đăng Ký Thành Công!</h2>
              <p className="text-muted mb-4">
                Thông tin tham dự sự kiện FPTU Tech Day 2026 đã được ghi nhận vào hệ thống.
              </p>

              {/* Chi tiết thông tin vé đã nhận qua location.state */}
              <div className="border rounded-4 p-4 bg-light text-start mb-4">
                <div className="mb-3">
                  <small className="text-muted d-block">Người tham dự:</small>
                  <strong className="fs-5 text-dark">Cảm ơn {data.name}!</strong>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block">Email nhận vé:</small>
                  <span className="text-primary fw-semibold">
                    Vé điện tử đã được gửi tới <u>{data.email}</u>
                  </span>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block">Buổi tham gia đã đăng ký:</small>
                  <Badge bg="info" className="px-3 py-2 fs-6 mt-1">
                    {data.session}
                  </Badge>
                </div>

                <div className="pt-2 border-top">
                  <small className="text-muted">
                    📌 <em>Ghi chú: Dữ liệu này được truyền bảo mật qua <code>location.state</code> mà không hề xuất hiện trên thanh URL.</em>
                  </small>
                </div>
              </div>

              {/* 2 Nút thao tác yêu cầu */}
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="px-4"
                  onClick={() => navigate('/register')}
                >
                  ➕ Đăng ký thêm người khác
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="px-4"
                  onClick={() => navigate('/')}
                >
                  🏠 Về trang sự kiện
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SuccessPage;

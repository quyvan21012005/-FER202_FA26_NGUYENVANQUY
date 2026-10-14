import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Hero Banner */}
      <Card className="border-0 shadow-sm p-4 p-md-5 mb-4 bg-white rounded-3 text-center">
        <Card.Body>
          <div className="mb-3">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fs-6 fw-semibold">
              Chào mừng bạn đến với Thư viện FPT
            </span>
          </div>
          <h1 className="fw-bold display-5 mb-3">Học Tập & Nghiên Cứu Không Giới Hạn</h1>
          <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: '750px' }}>
            Hệ thống thư viện hiện đại cung cấp hàng ngàn đầu sách công nghệ, kinh tế, giáo trình chuyên ngành
            và tài liệu số chuẩn quốc tế phục vụ sinh viên và giảng viên FPT University.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button as={Link} to="/books" variant="primary" size="lg" className="px-4">
              📖 Tra cứu sách ({'/books'})
            </Button>
            <Button as={Link} to="/help" variant="outline-primary" size="lg" className="px-4">
              💡 Hướng dẫn & Nội quy ({'/help'})
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Feature cards */}
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="fs-1 mb-2">📚</div>
              <h5 className="fw-bold">Kho Sách Phong Phú</h5>
              <p className="text-muted mb-0">
                Hơn 50,000 đầu sách in và kho học liệu trực tuyến từ IEEE, Wiley, Springer dành riêng cho FPTers.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="fs-1 mb-2">⚡</div>
              <h5 className="fw-bold">Mượn Trả Tiện Lợi</h5>
              <p className="text-muted mb-0">
                Thủ tục mượn sách nhanh chóng bằng thẻ sinh viên hoặc quét mã QR qua ứng dụng FPT Edu.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="fs-1 mb-2">🏢</div>
              <h5 className="fw-bold">Không Gian Yên Tĩnh</h5>
              <p className="text-muted mb-0">
                Khu tự học hiện đại, trang bị điều hòa 24/7, wifi tốc độ cao và các phòng thảo luận nhóm tiện nghi.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;

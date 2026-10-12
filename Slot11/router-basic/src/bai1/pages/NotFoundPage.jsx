import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm p-4">
            <Card.Body>
              <h1 className="display-1 fw-bold text-danger mb-2">404</h1>
              <h3 className="fw-bold mb-3">Trang không tồn tại</h3>
              <p className="text-muted mb-4">
                Đường dẫn bạn vừa truy cập không tồn tại hoặc đã được chuyển đi nơi khác.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button as={Link} to="/" variant="primary">
                  Về trang chủ
                </Button>
                <Button as={Link} to="/projects" variant="outline-secondary">
                  Xem dự án
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;

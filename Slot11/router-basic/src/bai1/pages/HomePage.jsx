import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="border-0 shadow-sm p-4 text-center bg-white">
            <Card.Body>
              <div className="mb-3">
                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fs-6">
                  Frontend Developer & Student
                </span>
              </div>
              <h1 className="fw-bold mb-3 display-5">Xin chào, mình là Văn Quý</h1>
              <p className="lead text-muted mb-4">
                Chào mừng bạn đến với portfolio cá nhân của mình! Mình là sinh viên FPT University, 
                đam mê lập trình web hiện đại với ReactJS, JavaScript và React Router.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button as={Link} to="/about" variant="primary" size="lg">
                  Xem giới thiệu (About)
                </Button>
                <Button as={Link} to="/contact" variant="outline-secondary" size="lg">
                  Liên hệ (Contact)
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;

import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã gửi lời nhắn! Mình sẽ phản hồi sớm nhất có thể.');
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="mb-4 text-center">
            <h2 className="fw-bold">Liên hệ với mình</h2>
            <p className="text-muted">
              Đừng ngần ngại để lại lời nhắn hoặc liên hệ trực tiếp qua thông tin bên dưới!
            </p>
          </div>

          <Row className="g-4 mb-4">
            <Col sm={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-3">
                <Card.Body>
                  <div className="text-primary fs-3 mb-2">📧</div>
                  <h6 className="fw-bold">Email</h6>
                  <small className="text-muted">quydaicaquadi@gmail.com</small>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-3">
                <Card.Body>
                  <div className="text-success fs-3 mb-2">📱</div>
                  <h6 className="fw-bold">Điện thoại</h6>
                  <small className="text-muted">(+84) 123 456 789</small>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-3">
                <Card.Body>
                  <div className="text-info fs-3 mb-2">📍</div>
                  <h6 className="fw-bold">Địa điểm</h6>
                  <small className="text-muted">FPT University, TP. HCM</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm p-4">
            <Card.Body>
              <h5 className="fw-bold mb-3">Gửi tin nhắn trực tiếp</h5>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="contactName">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control type="text" placeholder="Nhập họ và tên..." required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="contactEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Nhập địa chỉ email..." required />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="contactMessage">
                  <Form.Label>Nội dung lời nhắn</Form.Label>
                  <Form.Control as="textarea" rows={4} placeholder="Viết nội dung cần liên hệ..." required />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Gửi lời nhắn
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;

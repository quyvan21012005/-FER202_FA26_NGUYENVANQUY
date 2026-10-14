import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã gửi liên hệ!');
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h1 className="text-primary mb-3">Liên hệ với chúng tôi (Contact)</h1>
              <p className="text-muted mb-4">
                Điền thông tin bên dưới để gửi tin nhắn phản hồi cho chúng tôi.
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control type="text" placeholder="Nhập họ tên của bạn" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Nhập địa chỉ email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMessage">
                  <Form.Label>Nội dung tin nhắn</Form.Label>
                  <Form.Control as="textarea" rows={4} placeholder="Nhập nội dung cần hỗ trợ..." required />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Gửi tin nhắn
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;
import { Container, Card } from 'react-bootstrap';

function About() {
  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Card.Title as="h1" className="text-primary mb-3">
            About Us
          </Card.Title>
          <Card.Text className="lead text-muted">
            Chào mừng bạn đến với trang Giới thiệu (About) của bài thực hành Lab 5.
          </Card.Text>
          <p>
            Dự án này được xây dựng nhằm mục đích tìm hiểu và thực hành các khái niệm định tuyến (Routing) trong React sử dụng thư viện <strong>React Router DOM</strong> kết hợp với giao diện từ <strong>React Bootstrap</strong>.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default About;

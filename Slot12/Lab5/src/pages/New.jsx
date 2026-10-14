import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

function New() {
  const newsList = [
    {
      id: 1,
      title: 'React 19 Ra Mắt Với Nhiều Tính Năng Mới',
      category: 'Công nghệ',
      date: '14/10/2026',
      summary: 'React 19 mang đến những cải tiến mạnh mẽ về Server Actions, useActionState, và tối ưu hóa hiệu năng render.',
    },
    {
      id: 2,
      title: 'Tìm hiểu React Router v7 và Vite',
      category: 'Lập trình Web',
      date: '12/10/2026',
      summary: 'Khám phá cách cấu hình và triển khai Single Page Application mượt mà cùng React Router và Vite.',
    },
    {
      id: 3,
      title: 'Xây dựng giao diện Responsive với Bootstrap 5',
      category: 'Thiết kế',
      date: '10/10/2026',
      summary: 'Tận dụng hệ thống Grid và các component có sẵn của Bootstrap để tạo giao diện hiện đại và thích ứng mọi màn hình.',
    },
  ];

  return (
    <Container className="py-4">
      <h1 className="text-primary mb-4">Tin tức mới nhất (News)</h1>
      <Row className="g-4">
        {newsList.map((item) => (
          <Col md={4} key={item.id}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column">
                <div className="mb-2">
                  <Badge bg="info" className="text-dark">
                    {item.category}
                  </Badge>{' '}
                  <small className="text-muted">{item.date}</small>
                </div>
                <Card.Title className="h5">{item.title}</Card.Title>
                <Card.Text className="text-secondary flex-grow-1">
                  {item.summary}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default New;

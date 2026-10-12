import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const PROJECTS = [
  {
    id: 1,
    title: 'Website Cửa hàng Mini (MiniShop)',
    desc: 'Ứng dụng mua sắm trực tuyến với tính năng giỏ hàng, lọc sản phẩm theo danh mục và form thanh toán validation.',
    techs: ['React', 'React-Bootstrap', 'Context API', 'useReducer'],
    status: 'Hoàn thành',
  },
  {
    id: 2,
    title: 'Hệ thống Quản lý Thư viện (FPT Library)',
    desc: 'Trang web thư viện hỗ trợ tra cứu sách, xem hướng dẫn quy định sinh viên với cấu trúc layout lồng nhau.',
    techs: ['React Router', 'Bootstrap', 'SPA Layout'],
    status: 'Đang phát triển',
  },
  {
    id: 3,
    title: 'Cổng Đăng ký Sự kiện Công nghệ (Tech Day)',
    desc: 'Nền tảng đăng ký tham dự workshop và hội thảo công nghệ với xác thực form và điều hướng thông minh.',
    techs: ['React', 'useNavigate', 'Form Validation'],
    status: 'Hoàn thành',
  },
];

const ProjectsPage = () => {
  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Dự án tiêu biểu</h2>
        <p className="text-muted">Các dự án thực tế đã hoàn thành trong môn học FER202.</p>
      </div>

      <Row className="g-4">
        {PROJECTS.map((project) => (
          <Col md={4} key={project.id}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <span className="fw-semibold text-secondary">Dự án #{project.id}</span>
                <Badge bg={project.status === 'Hoàn thành' ? 'success' : 'warning'}>
                  {project.status}
                </Badge>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{project.title}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">
                  {project.desc}
                </Card.Text>
                <div className="mb-3">
                  {project.techs.map((tech) => (
                    <Badge key={tech} bg="secondary" className="me-1 mb-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline-primary" size="sm" className="w-100">
                  Xem chi tiết
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProjectsPage;

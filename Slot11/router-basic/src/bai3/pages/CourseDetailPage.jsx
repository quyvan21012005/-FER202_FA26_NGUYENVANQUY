import { Container, Card, Alert, Button, Badge, Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { findCourse } from '../data/courses';

const CourseDetailPage = () => {
  const { code } = useParams();
  const course = findCourse(code);

  if (!course) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Alert variant="danger" className="text-center shadow-sm p-4">
              <Alert.Heading className="fw-bold">Lỗi: Môn học không tồn tại!</Alert.Heading>
              <p className="my-3">
                Không tìm thấy môn học có mã <strong>{code}</strong> trong chương trình đào tạo.
              </p>
              <hr />
              <div className="d-flex justify-content-center">
                <Button as={Link} to="/courses" variant="danger">
                  ← Quay lại danh sách môn học
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
              <h4 className="mb-0 fw-bold">{course.code}</h4>
              <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                {course.semester}
              </Badge>
            </Card.Header>
            <Card.Body className="p-4">
              <Card.Title className="fw-bold fs-4 mb-3">
                {course.name}
              </Card.Title>
              <div className="mb-3">
                <Badge bg="info" className="me-2 px-3 py-2">
                  Số tín chỉ: {course.credits}
                </Badge>
                <Badge bg="secondary" className="px-3 py-2">
                  Học phần bắt buộc
                </Badge>
              </div>
              <Card.Text className="text-secondary lead fs-6 mb-4">
                {course.desc}
              </Card.Text>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <Button as={Link} to="/courses" variant="outline-primary">
                  ← Quay lại danh sách
                </Button>
                <span className="text-muted small">Môn học ngành KTPM (FPT University)</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetailPage;

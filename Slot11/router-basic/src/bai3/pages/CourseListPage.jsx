import { Container, Table, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { COURSES } from '../data/courses';

const CourseListPage = () => {
  return (
    <Container className="py-4">
      <div className="mb-4 text-center">
        <h2 className="fw-bold">Danh Sách Môn Học FPT University</h2>
        <p className="text-muted">
          Bấm vào mã môn học để xem thông tin chi tiết của môn đó (Dynamic Route: <code>/courses/:code</code>).
        </p>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '15%' }}>Mã môn</th>
                <th style={{ width: '45%' }}>Tên môn học</th>
                <th style={{ width: '15%' }} className="text-center">Số tín chỉ</th>
                <th style={{ width: '15%' }} className="text-center">Học kỳ</th>
                <th style={{ width: '10%' }} className="text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {COURSES.map((course) => (
                <tr key={course.code}>
                  <td>
                    <Link
                      to={`/courses/${course.code}`}
                      className="fw-bold text-primary text-decoration-none"
                    >
                      {course.code}
                    </Link>
                  </td>
                  <td>{course.name}</td>
                  <td className="text-center">
                    <Badge bg="info" className="px-2 py-1">
                      {course.credits} tín chỉ
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Badge bg="secondary" className="px-2 py-1">
                      {course.semester}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button
                      as={Link}
                      to={`/courses/${course.code}`}
                      variant="outline-primary"
                      size="sm"
                    >
                      Xem
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CourseListPage;

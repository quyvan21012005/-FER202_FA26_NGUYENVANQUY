import { Container, Card, Row, Col, Form, Button, Table, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { STUDENTS, CLASSES } from '../data/students';

const StudentListPage = () => {
  // Lấy và cập nhật query string từ URL thông qua useSearchParams
  // Tuyệt đối không dùng useState cho các biến bộ lọc
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc giá trị từ URL, nếu không có thì mặc định chuỗi rỗng
  const q = searchParams.get('q') ?? '';
  const selectedClass = searchParams.get('class') ?? '';

  // Hàm cập nhật từng tham số vào URL:
  // - Nếu value rỗng thì xóa tham số khỏi URL
  // - replace = true (khi gõ phím) để tránh tạo mục lịch sử cho từng ký tự
  // - replace = false (khi chọn lớp) để bấm Back có thể quay về lớp trước
  const updateParam = (key, value, replace = false) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace }
    );
  };

  // Nút xóa lọc: xóa toàn bộ query string
  const handleClearFilters = () => {
    setSearchParams({});
  };

  // Dữ liệu dẫn xuất (Derived state): tính toán kết quả lọc trực tiếp khi render
  const normalizedKeyword = q.trim().toLowerCase();
  const filteredStudents = STUDENTS.filter((student) => {
    const matchKeyword =
      !normalizedKeyword ||
      student.name.toLowerCase().includes(normalizedKeyword) ||
      student.id.toLowerCase().includes(normalizedKeyword);

    const matchClass = !selectedClass || student.className === selectedClass;

    return matchKeyword && matchClass;
  });

  return (
    <Container className="py-4">
      {/* Tiêu đề trang */}
      <div className="mb-4 text-center">
        <h2 className="fw-bold">Danh Bạ Sinh Viên FPT University</h2>
        <p className="text-muted">
          Thực hành quản lý trạng thái tìm kiếm và bộ lọc trực tiếp trên URL với <code>useSearchParams</code>.
        </p>
      </div>

      {/* Thanh bộ lọc: Ô tìm kiếm, Chọn lớp và Nút xóa lọc */}
      <Card className="border-0 shadow-sm p-4 mb-4 rounded-4 bg-white">
        <Row className="g-3 align-items-end">
          {/* Ô tìm kiếm theo tên hoặc MSSV */}
          <Col md={6}>
            <Form.Group controlId="searchKeyword">
              <Form.Label className="fw-semibold">🔍 Tìm kiếm theo tên hoặc MSSV:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên sinh viên (ví dụ: anh, hân) hoặc MSSV..."
                value={q}
                onChange={(e) => updateParam('q', e.target.value, true)}
                autoComplete="off"
              />
            </Form.Group>
          </Col>

          {/* Ô chọn lớp */}
          <Col md={4}>
            <Form.Group controlId="selectClass">
              <Form.Label className="fw-semibold">🏫 Lọc theo lớp học:</Form.Label>
              <Form.Select
                value={selectedClass}
                onChange={(e) => updateParam('class', e.target.value, false)}
              >
                <option value="">-- Tất cả lớp --</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Nút xóa lọc */}
          <Col md={2}>
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={handleClearFilters}
              disabled={!q && !selectedClass}
            >
              🔄 Xóa lọc
            </Button>
          </Col>
        </Row>

        {/* Thông tin thống kê và URL hiện tại */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top flex-wrap gap-2">
          <span className="fw-bold text-primary">
            Tìm thấy {filteredStudents.length}/{STUDENTS.length} sinh viên
          </span>
          <small className="text-muted">
            URL Query: <code>{searchParams.toString() ? `?${searchParams.toString()}` : '(không có bộ lọc)'}</code>
          </small>
        </div>
      </Card>

      {/* Bảng danh sách sinh viên */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '15%' }}>MSSV</th>
                <th style={{ width: '35%' }}>Họ và tên</th>
                <th style={{ width: '20%' }} className="text-center">Lớp</th>
                <th style={{ width: '15%' }} className="text-center">Điểm GPA</th>
                <th style={{ width: '15%' }} className="text-center">Xếp loại</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="fw-bold text-primary">{student.id}</td>
                    <td className="fw-semibold">{student.name}</td>
                    <td className="text-center">
                      <Badge bg="secondary" className="px-2 py-1">
                        {student.className}
                      </Badge>
                    </td>
                    <td className="text-center fw-bold">{student.gpa.toFixed(2)}</td>
                    <td className="text-center">
                      <Badge
                        bg={student.gpa >= 3.6 ? 'success' : student.gpa >= 3.2 ? 'info' : 'warning'}
                        className="px-2 py-1"
                      >
                        {student.gpa >= 3.6 ? 'Xuất sắc' : student.gpa >= 3.2 ? 'Giỏi' : 'Khá'}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <div className="fs-1 mb-2">🔎</div>
                    <h6 className="fw-bold text-secondary mb-1">Không có sinh viên phù hợp.</h6>
                    <small>Vui lòng thử từ khóa khác hoặc bấm nút "Xóa lọc" để xem toàn bộ danh sách.</small>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentListPage;

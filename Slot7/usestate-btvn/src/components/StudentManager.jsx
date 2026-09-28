import React, { useState } from 'react';
import {
  Container,
  Card,
  Table,
  Form,
  Button,
  Badge,
  Row,
  Col,
  Alert,
} from 'react-bootstrap';

// Danh sách các thành phố
const CITIES = ['Hà Nội', 'Đà Nẵng', 'TP.HCM', 'Cần Thơ'];

// Dữ liệu sinh viên mẫu ban đầu theo đề bài
const initialStudents = [
  { id: 1, name: 'Nguyễn Văn An', score: 8.5, contact: { city: 'Hà Nội' } },
  { id: 2, name: 'Trần Thị Bình', score: 4.5, contact: { city: 'Đà Nẵng' } },
  { id: 3, name: 'Lê Minh Châu', score: 6, contact: { city: 'TP.HCM' } },
];

export default function StudentManager() {
  // 3 state cơ bản theo yêu cầu bài học
  const [students, setStudents] = useState(initialStudents);
  const [newName, setNewName] = useState('');
  const [sortBy, setSortBy] = useState('none'); // 'none' | 'name' | 'score'

  // 1. Thêm sinh viên mới (tên ít nhất 3 ký tự, điểm mặc định 0)
  const addStudent = (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (trimmed.length < 3) return;

    setStudents((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: trimmed,
        score: 0,
        contact: { city: CITIES[0] },
      },
    ]);
    setNewName('');
  };

  // 2. Sửa điểm trực tiếp (kẹp trong 0–10, bước 0.5)
  const updateScore = (id, value) => {
    if (value === '') {
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, score: '' } : s))
      );
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num)) {
      const clampedScore = Math.min(10, Math.max(0, num));
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, score: clampedScore } : s))
      );
    }
  };

  // 3. Sửa thành phố (Cập nhật object lồng nhau 2 cấp theo nguyên tắc Bất Biến)
  const updateCity = (id, city) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              contact: {
                ...s.contact,
                city,
              },
            }
          : s
      )
    );
  };

  // 4. Xóa sinh viên (dùng filter)
  const removeStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // 5. Cộng +0.5 cho cả lớp (không vượt quá 10)
  const bonusAll = () => {
    setStudents((prev) =>
      prev.map((s) => {
        const current = Number(s.score) || 0;
        const newScore = Math.min(
          10,
          parseFloat((current + 0.5).toFixed(1))
        );
        return { ...s, score: newScore };
      })
    );
  };

  // 6. Sắp xếp danh sách hiển thị là biến dẫn xuất (không mutate state gốc)
  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name, 'vi');
    }
    if (sortBy === 'score') {
      return (Number(b.score) || 0) - (Number(a.score) || 0); // Điểm cao -> thấp
    }
    return 0; // Thứ tự nhập ban đầu
  });

  // 7. Thống kê dẫn xuất (Sĩ số, Điểm trung bình, Số lượng đạt)
  const totalStudents = students.length;
  const average =
    totalStudents === 0
      ? '0.00'
      : (
          students.reduce((sum, s) => sum + (Number(s.score) || 0), 0) /
          totalStudents
        ).toFixed(2);
  const passedCount = students.filter(
    (s) => (Number(s.score) || 0) >= 5
  ).length;

  return (
    <Container className="py-4" style={{ maxWidth: '880px' }}>
      {/* Tiêu đề */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Bài 4: Quản lý điểm sinh viên</h2>
        <p className="text-muted">
          Thực hành CRUD mảng object, cập nhật object lồng nhau & Sắp xếp bất biến
        </p>
      </div>

      {/* Thanh công cụ: Thêm sinh viên & Sắp xếp & Nút +0.5 cả lớp */}
      <Card className="p-3 mb-4 bg-white shadow-sm border">
        <Row className="g-3 align-items-center">
          {/* Form thêm sinh viên */}
          <Col lg={6} md={12}>
            <Form onSubmit={addStudent} className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Nhập họ tên sinh viên (tối thiểu 3 ký tự)..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={newName.trim().length < 3}
                style={{ whiteSpace: 'nowrap' }}
              >
                + Thêm
              </Button>
            </Form>
          </Col>

          {/* Lựa chọn sắp xếp */}
          <Col lg={3} sm={6}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sắp xếp danh sách"
            >
              <option value="none">Thứ tự nhập</option>
              <option value="name">Theo tên (A → Z)</option>
              <option value="score">Điểm cao → thấp</option>
            </Form.Select>
          </Col>

          {/* Nút cộng điểm cả lớp */}
          <Col lg={3} sm={6} className="text-lg-end">
            <Button
              variant="outline-success"
              onClick={bonusAll}
              disabled={totalStudents === 0}
              className="w-100"
            >
              +0.5 cả lớp
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Bảng danh sách sinh viên */}
      <Card className="bg-white shadow-sm border mb-4">
        <Table responsive hover className="mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: '60px' }} className="text-center">#</th>
              <th>Họ và tên</th>
              <th style={{ width: '130px' }}>Điểm (0 - 10)</th>
              <th style={{ width: '160px' }}>Thành phố</th>
              <th style={{ width: '110px' }} className="text-center">Kết quả</th>
              <th style={{ width: '90px' }} className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student, index) => {
              const currentScore = Number(student.score) || 0;
              const isPassed = currentScore >= 5;

              return (
                <tr key={student.id}>
                  <td className="text-center text-muted fw-semibold">
                    {index + 1}
                  </td>
                  <td className="fw-semibold text-dark">{student.name}</td>
                  <td>
                    <Form.Control
                      type="number"
                      step="0.5"
                      min="0"
                      max="10"
                      value={student.score}
                      onChange={(e) => updateScore(student.id, e.target.value)}
                      style={{ width: '85px', textAlign: 'center' }}
                      className="fw-bold"
                    />
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={student.contact?.city || CITIES[0]}
                      onChange={(e) => updateCity(student.id, e.target.value)}
                    >
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td className="text-center">
                    <Badge bg={isPassed ? 'success' : 'danger'} className="px-2 py-1">
                      {isPassed ? 'Đạt' : 'Chưa đạt'}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeStudent(student.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              );
            })}

            {totalStudents === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  Danh sách sinh viên trống. Hãy thêm sinh viên mới ở trên!
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Thanh thống kê số liệu dẫn xuất dưới bảng */}
        <Card.Footer className="bg-light py-3 border-top">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 fw-semibold text-secondary">
            <span>
              Sĩ số: <span className="text-dark fw-bold">{totalStudents}</span>
            </span>
            <span>
              Điểm trung bình:{' '}
              <span className="text-primary fw-bold">{average}</span>
            </span>
            <span>
              Đạt:{' '}
              <span className="text-success fw-bold">
                {passedCount}/{totalStudents}
              </span>
            </span>
          </div>
        </Card.Footer>
      </Card>

      {/* Ghi chú về tính bất biến (Immutability) */}
      <Alert variant="info" className="shadow-sm">
        <div className="fw-bold mb-1">💡 Lưu ý quan trọng về tính Bất Biến (Immutability):</div>
        <small>
          - <strong>Object lồng nhau:</strong> Khi đổi thành phố, ta sao chép cả 2 cấp{' '}
          <code>{'{ ...s, contact: { ...s.contact, city } }'}</code>. Không gán trực tiếp{' '}
          <code>s.contact.city = city</code> để tránh làm sai lệch dữ liệu tham chiếu ngầm.<br />
          - <strong>Sắp xếp không làm hỏng state:</strong> Sắp xếp trên bản sao{' '}
          <code>[...students].sort(...)</code> giúp khi chọn lại <em>"Thứ tự nhập"</em>, danh sách lập tức trở về đúng thứ tự ban đầu.
        </small>
      </Alert>
    </Container>
  );
}

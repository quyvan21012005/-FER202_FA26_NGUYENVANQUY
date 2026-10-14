import { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  // State lưu dữ liệu form
  const [form, setForm] = useState({
    name: '',
    email: '',
    session: 'Sáng (08:00 - 11:30)',
  });

  // State lưu thông báo lỗi
  const [error, setError] = useState('');

  // Hàm xử lý thay đổi dữ liệu chung sử dụng [e.target.name]
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (error) setError('');
  };

  // Hàm submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();

    // 1. Kiểm tra họ tên
    if (!trimmedName) {
      setError('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    // 2. Kiểm tra email (phải có ký tự @)
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Email không hợp lệ. Vui lòng nhập đúng định dạng email (ví dụ: email@fe.edu.vn).');
      return;
    }

    // 3. Hợp lệ: điều hướng sang /success bằng code, truyền dữ liệu qua location.state
    // Dùng replace: true để thay thế trang /register trong lịch sử duyệt
    // -> khi ở /success bấm Back sẽ quay về trang sự kiện /, KHÔNG quay lại form đăng ký
    navigate('/success', {
      state: {
        name: trimmedName,
        email: trimmedEmail,
        session: form.session,
      },
      replace: true,
    });
  };

  return (
    <div className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Header className="bg-dark text-white p-4 rounded-top-4">
              <h4 className="fw-bold mb-1">Đăng Ký Tham Dự</h4>
              <p className="text-light-50 small mb-0">FPTU Tech Day 2026 - Sự kiện kết nối công nghệ</p>
            </Card.Header>

            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
                  <strong>⚠️ Lỗi nhập liệu:</strong> {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Họ và tên */}
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label className="fw-semibold">
                    Họ và tên <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ví dụ: Trần Bình"
                    size="lg"
                  />
                  <Form.Text className="text-muted">
                    Họ tên sẽ được in trên vé điện tử và chứng nhận tham gia.
                  </Form.Text>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className="fw-semibold">
                    Địa chỉ Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    size="lg"
                  />
                  <Form.Text className="text-muted">
                    Hệ thống sẽ gửi vé QR Code và tài liệu sự kiện qua email này.
                  </Form.Text>
                </Form.Group>

                {/* Buổi tham dự */}
                <Form.Group className="mb-4" controlId="formSession">
                  <Form.Label className="fw-semibold">Chọn buổi tham dự</Form.Label>
                  <div className="d-flex flex-column gap-2 mt-1">
                    <Form.Check
                      type="radio"
                      id="session-morning"
                      name="session"
                      value="Sáng (08:00 - 11:30)"
                      label="☀️ Buổi Sáng: 08:00 - 11:30 (AI & Frontend Engineering)"
                      checked={form.session === 'Sáng (08:00 - 11:30)'}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="radio"
                      id="session-afternoon"
                      name="session"
                      value="Chiều (13:30 - 17:00)"
                      label="⛅ Buổi Chiều: 13:30 - 17:00 (Cloud & Career Coaching)"
                      checked={form.session === 'Chiều (13:30 - 17:00)'}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>

                {/* 2 Nút thao tác: Quay lại và Gửi đăng ký */}
                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                    className="px-4"
                  >
                    ← Quay lại
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-4 fw-bold"
                  >
                    Gửi đăng ký →
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;

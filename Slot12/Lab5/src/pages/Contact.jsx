import { useState, useReducer } from 'react';
import { Container, Card, Row, Col, Form, Button, Modal } from 'react-bootstrap';

// 1. Trạng thái khởi tạo của Form
const initialFormState = {
  values: {
    fullName: '',
    email: '',
    phone: '',
    message: ''
  },
  errors: {},
  touched: {}
};

// 2. Hàm validation cho từng trường
const validateField = (name, value) => {
  let error = '';
  switch (name) {
    case 'fullName':
      if (!value.trim()) {
        error = 'Họ và tên không được để trống.';
      } else if (value.trim().length < 3) {
        error = 'Họ và tên phải có ít nhất 3 ký tự.';
      }
      break;

    case 'email':
      if (!value.trim()) {
        error = 'Email không được để trống.';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        error = 'Email không đúng định dạng (VD: example@gmail.com).';
      }
      break;

    case 'phone':
      if (!value.trim()) {
        error = 'Số điện thoại không được để trống.';
      } else if (!/^[0-9]{10}$/.test(value.trim())) {
        error = 'Số điện thoại phải gồm đúng 10 chữ số.';
      }
      break;

    case 'message':
      if (!value.trim()) {
        error = 'Nội dung tin nhắn không được để trống.';
      } else if (value.trim().length < 10) {
        error = 'Nội dung tin nhắn phải có ít nhất 10 ký tự.';
      }
      break;

    default:
      break;
  }
  return error;
};

// 3. Reducer xử lý validation và cập nhật dữ liệu
function formReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_FIELD': {
      const { name, value } = action.payload;
      const error = validateField(name, value);
      return {
        ...state,
        values: {
          ...state.values,
          [name]: value
        },
        errors: {
          ...state.errors,
          [name]: error
        },
        touched: {
          ...state.touched,
          [name]: true
        }
      };
    }

    case 'VALIDATE_ALL': {
      const errors = {};
      const touched = {};
      Object.keys(state.values).forEach((field) => {
        const error = validateField(field, state.values[field]);
        if (error) {
          errors[field] = error;
        }
        touched[field] = true;
      });
      return {
        ...state,
        errors,
        touched
      };
    }

    case 'RESET_FORM':
      return initialFormState;

    default:
      return state;
  }
}

function Contact() {
  // Quản lý Form State & Validation bằng useReducer theo yêu cầu B8
  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  // Quản lý hiển thị Modal bằng useState (showModal) theo yêu cầu B8
  const [showModal, setShowModal] = useState(false);

  // Lưu thông tin đã submit để hiển thị trong Modal
  const [submittedData, setSubmittedData] = useState(null);

  // Xử lý khi thay đổi ô input
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'CHANGE_FIELD',
      payload: { name, value }
    });
  };

  // Xử lý khi submit Form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra toàn bộ lỗi của form
    const currentErrors = {};
    let isValid = true;
    Object.keys(formState.values).forEach((field) => {
      const error = validateField(field, formState.values[field]);
      if (error) {
        currentErrors[field] = error;
        isValid = false;
      }
    });

    dispatch({ type: 'VALIDATE_ALL' });

    // Nếu dữ liệu hợp lệ (valid), mở modal hiển thị thông tin
    if (isValid) {
      setSubmittedData({ ...formState.values });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_FORM' });
    setShowModal(false);
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h1 className="h3 fw-bold text-primary mb-2">Liên Hệ Với Chúng Tôi</h1>
              <p className="text-muted mb-4">
                Vui lòng điền đầy đủ thông tin bên dưới. Hệ thống sử dụng <strong>useReducer</strong> để kiểm tra validation.
              </p>

              <Form noValidate onSubmit={handleSubmit}>
                {/* Họ và tên */}
                <Form.Group className="mb-3" controlId="formFullName">
                  <Form.Label className="fw-semibold">
                    Họ và tên <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Nhập họ và tên của bạn"
                    value={formState.values.fullName}
                    onChange={handleChange}
                    isInvalid={formState.touched.fullName && !!formState.errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.fullName}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className="fw-semibold">
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    value={formState.values.email}
                    onChange={handleChange}
                    isInvalid={formState.touched.email && !!formState.errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Số điện thoại */}
                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label className="fw-semibold">
                    Số điện thoại <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Nhập số điện thoại 10 số"
                    value={formState.values.phone}
                    onChange={handleChange}
                    isInvalid={formState.touched.phone && !!formState.errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Nội dung tin nhắn */}
                <Form.Group className="mb-4" controlId="formMessage">
                  <Form.Label className="fw-semibold">
                    Nội dung tin nhắn <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    placeholder="Nhập nội dung cần hỗ trợ (tối thiểu 10 ký tự)..."
                    value={formState.values.message}
                    onChange={handleChange}
                    isInvalid={formState.touched.message && !!formState.errors.message}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formState.errors.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Nút gửi form */}
                <Button variant="primary" type="submit" size="lg" className="w-100 fw-bold shadow-sm">
                  Gửi Liên Hệ
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal hiển thị khi dữ liệu form valid theo yêu cầu B8 */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="h5 fw-bold">Completed Lab5</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="alert alert-success d-flex align-items-center mb-3">
            <span className="me-2 fs-5">✓</span>
            <div><strong>Dữ liệu hợp lệ!</strong> Form đã được gửi thành công.</div>
          </div>

          <h6 className="fw-bold text-dark mb-3">Thông tin đã nhập vào form:</h6>

          {submittedData && (
            <ul className="list-group list-group-flush border rounded-3">
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Họ và tên:</span>
                <span className="fw-semibold text-dark">{submittedData.fullName}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Email:</span>
                <span className="fw-semibold text-dark">{submittedData.email}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Số điện thoại:</span>
                <span className="fw-semibold text-dark">{submittedData.phone}</span>
              </li>
              <li className="list-group-item">
                <div className="text-muted mb-1">Nội dung tin nhắn:</div>
                <div className="p-2 bg-light rounded text-dark fst-italic">
                  "{submittedData.message}"
                </div>
              </li>
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="outline-primary" onClick={handleReset}>
            Nhập form mới
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Contact;
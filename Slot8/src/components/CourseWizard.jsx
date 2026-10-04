import { useReducer } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import { COURSES, SCHEDULES, STEPS, wizardReducer, initWizard } from './wizardReducer';

const formatVND = (n) =>
  typeof n === 'number'
    ? n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    : '';

const CourseWizard = ({ initialCourseId = 'react' }) => {
  // useReducer(reducer, đối số cho init, hàm init)
  const [state, dispatch] = useReducer(wizardReducer, initialCourseId, initWizard);
  const { step, maxVisited, values, errors, submitted } = state;
  const course = COURSES.find((c) => c.id === values.courseId);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch({ type: 'CHANGE', payload: { name, value: type === 'checkbox' ? checked : value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: step === STEPS.length - 1 ? 'SUBMIT' : 'NEXT' });
  };

  if (submitted) {
    return (
      <Alert variant="success" style={{ maxWidth: 560 }} className="mx-auto shadow-sm">
        <Alert.Heading>Đăng ký thành công!</Alert.Heading>
        <p className="mb-3">
          Học viên <strong>{values.fullName}</strong> đã đăng ký khóa học{' '}
          <strong>{course ? course.name : ''}</strong> ({values.schedule}).
          <br />
          Học phí: <strong>{course ? formatVND(course.fee) : ''}</strong>.
        </p>
        <Button
          variant="outline-success"
          onClick={() => dispatch({ type: 'RESET', payload: initialCourseId })}
        >
          Đăng ký khóa khác
        </Button>
      </Alert>
    );
  }

  const field = (name, label, type = 'text') => (
    <Form.Group className="mb-3" controlId={`wz-${name}`}>
      <Form.Label className="fw-semibold">{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={values[name]}
        onChange={handleChange}
        isInvalid={Boolean(errors[name])}
      />
      <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <Card style={{ maxWidth: 580 }} className="mx-auto shadow-sm border-0">
      <Card.Header className="bg-white border-bottom pt-3">
        <Nav variant="pills" justify>
          {STEPS.map((label, i) => (
            <Nav.Item key={label}>
              <Nav.Link
                active={i === step}
                disabled={i > maxVisited}
                onClick={() => dispatch({ type: 'GO_TO', payload: i })}
                style={{ cursor: i <= maxVisited ? 'pointer' : 'not-allowed' }}
              >
                {`${i + 1}. ${label}`}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Card.Header>
      <Card.Body>
        <Form noValidate onSubmit={handleSubmit}>
          {step === 0 && (
            <div>
              <h5 className="fw-bold mb-3 text-secondary">Bước 1: Thông tin học viên</h5>
              {field('fullName', 'Họ và tên')}
              {field('email', 'Email', 'email')}
              {field('phone', 'Số điện thoại', 'tel')}
            </div>
          )}

          {step === 1 && (
            <div>
              <h5 className="fw-bold mb-3 text-secondary">Bước 2: Chọn khóa học &amp; lịch</h5>
              <Form.Group className="mb-3" controlId="wz-courseId">
                <Form.Label className="fw-semibold">Khóa học</Form.Label>
                <Form.Select
                  name="courseId"
                  value={values.courseId}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.courseId)}
                >
                  <option value="">-- Chọn khóa học --</option>
                  {COURSES.map(({ id, name, fee }) => (
                    <option key={id} value={id}>{`${name} – ${formatVND(fee)}`}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.courseId}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="d-block fw-semibold">Lịch học</Form.Label>
                {SCHEDULES.map((s, i) => (
                  <Form.Check
                    inline
                    key={s}
                    type="radio"
                    id={`wz-schedule-${i}`}
                    name="schedule"
                    label={s}
                    value={s}
                    checked={values.schedule === s}
                    onChange={handleChange}
                    isInvalid={Boolean(errors.schedule)}
                  />
                ))}
                {errors.schedule && <div className="text-danger small mt-1">{errors.schedule}</div>}
              </Form.Group>
            </div>
          )}

          {step === 2 && (
            <div>
              <h5 className="fw-bold mb-3 text-secondary">Bước 3: Xác nhận thông tin</h5>
              <ListGroup className="mb-3">
                <ListGroup.Item>{`Học viên: ${values.fullName}`}</ListGroup.Item>
                <ListGroup.Item>{`Liên hệ: ${values.email} · ${values.phone}`}</ListGroup.Item>
                <ListGroup.Item>{`Khóa học: ${course?.name ?? ''} · ${values.schedule}`}</ListGroup.Item>
                <ListGroup.Item className="fw-bold text-success">
                  {`Học phí: ${course ? formatVND(course.fee) : ''}`}
                </ListGroup.Item>
              </ListGroup>
              <Form.Check
                id="wz-agree"
                name="agree"
                className="mb-3"
                label="Tôi xác nhận thông tin trên là chính xác"
                checked={values.agree}
                onChange={handleChange}
                isInvalid={Boolean(errors.agree)}
                feedback={errors.agree}
                feedbackType="invalid"
              />
            </div>
          )}

          <div className="d-flex justify-content-between pt-3 border-top">
            <Button
              variant="outline-secondary"
              disabled={step === 0}
              onClick={() => dispatch({ type: 'BACK' })}
            >
              ← Quay lại
            </Button>
            <Button type="submit" variant={step === STEPS.length - 1 ? 'success' : 'primary'}>
              {step === STEPS.length - 1 ? 'Xác nhận đăng ký' : 'Tiếp tục →'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CourseWizard;

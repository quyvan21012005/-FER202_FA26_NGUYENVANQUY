import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import InputField from './InputField';
import AppButton from './AppButton';
import { fields, genders, majors, initialValues } from '../data/registerConfig';
import { validateRegister } from '../utils/validateRegister';

const ValidatedRegisterForm = () => {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState('');

  // errors là dữ liệu dẫn xuất từ values → tính lại mỗi lần render
  const errors = validateRegister(values);
  const isValid = Object.keys(errors).length === 0;
  // Chỉ hiện lỗi của ô đã được chạm (blur) hoặc sau khi bấm submit
  const showError = (name) => (touched[name] ? errors[name] : undefined);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setSuccess('');
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Đánh dấu tất cả là đã chạm để lộ mọi lỗi còn lại
    const allTouched = Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);
    if (!isValid) return;

    setSuccess(`Đăng ký thành công! Chào mừng ${values.fullName.trim()}.`);
    setValues(initialValues);
    setTouched({});
  };

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="mb-3">Đăng ký tài khoản (Validation nâng cao)</Card.Title>
            {success && <Alert variant="success">{success}</Alert>}

            <Form noValidate onSubmit={handleSubmit}>
              {fields.map((field) => (
                <InputField
                  key={field.id}
                  {...field}
                  name={field.id}
                  value={values[field.id]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError(field.id)}
                />
              ))}

              <Form.Group className="mb-3">
                <Form.Label className="d-block">Giới tính</Form.Label>
                {genders.map((gender) => (
                  <Form.Check
                    inline
                    key={gender}
                    type="radio"
                    name="gender"
                    id={`v-gender-${gender}`}
                    label={gender}
                    value={gender}
                    checked={values.gender === gender}
                    onChange={handleChange}
                  />
                ))}
              </Form.Group>

              <Form.Group className="mb-3" controlId="v-major">
                <Form.Label>
                  Chuyên ngành <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="major"
                  value={values.major}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={Boolean(showError('major'))}
                >
                  <option value="">-- Chọn chuyên ngành --</option>
                  {majors.map((major) => (
                    <option key={major}>{major}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{showError('major')}</Form.Control.Feedback>
              </Form.Group>

              <Form.Check
                className="mb-3"
                type="checkbox"
                id="v-agree"
                name="agree"
                label="Tôi đồng ý điều khoản"
                checked={values.agree}
                onChange={handleChange}
                isInvalid={Boolean(showError('agree'))}
                feedback={showError('agree')}
                feedbackType="invalid"
              />

              <AppButton type="submit" className="w-100">
                Đăng ký
              </AppButton>
              <Form.Text muted className="d-block mt-2 text-center">
                {isValid ? 'Thông tin hợp lệ' : `Còn ${Object.keys(errors).length} mục chưa hợp lệ`}
              </Form.Text>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ValidatedRegisterForm;

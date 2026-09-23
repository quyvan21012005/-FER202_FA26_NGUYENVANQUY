import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputField from './InputField';
import AppButton from './AppButton';
import { fields, genders, majors } from '../data/registerConfig';

const RegisterForm = () => {
  return (
    <Row className="justify-content-center my-4">
      <Col md={6}>
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white text-center fw-bold">
            Đăng ký tài khoản
          </Card.Header>
          <Card.Body>
            <Form onSubmit={(event) => event.preventDefault()}>
              {fields.map((field) => (
                <InputField key={field.id} {...field} />
              ))}

              <Form.Group className="mb-3">
                <Form.Label className="d-block">Giới tính</Form.Label>
                {genders.map((gender) => (
                  <Form.Check
                    inline
                    key={gender}
                    type="radio"
                    name="gender"
                    id={`gender-${gender}`}
                    label={gender}
                  />
                ))}
              </Form.Group>

              <Form.Group className="mb-3" controlId="major">
                <Form.Label>Chuyên ngành</Form.Label>
                <Form.Select defaultValue="">
                  <option value="" disabled>-- Chọn chuyên ngành --</option>
                  {majors.map((major) => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="terms">
                <Form.Check type="checkbox" label="Tôi đồng ý điều khoản" required />
              </Form.Group>

              <AppButton type="submit" className="w-100">
                Đăng ký
              </AppButton>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterForm ;
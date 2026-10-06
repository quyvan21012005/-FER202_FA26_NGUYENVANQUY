import Form from 'react-bootstrap/Form';

const InputField = ({ id, label, helpText, error, ...inputProps }) => (
  <Form.Group className="mb-3" controlId={id}>
    <Form.Label>
      {label}
      {inputProps.required && <span className="text-danger"> *</span>}
    </Form.Label>
    <Form.Control {...inputProps} isInvalid={Boolean(error)} />
    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    {helpText && !error && <Form.Text muted>{helpText}</Form.Text>}
  </Form.Group>
);

export default InputField;

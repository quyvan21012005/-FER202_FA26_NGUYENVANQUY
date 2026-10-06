import Button from 'react-bootstrap/Button';

const AppButton = ({ variant = 'primary', children, ...rest }) => (
  <Button variant={variant} {...rest}>
    {children}
  </Button>
);

export default AppButton;

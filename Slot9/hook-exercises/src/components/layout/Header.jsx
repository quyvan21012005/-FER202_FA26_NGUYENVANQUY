import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { APP_NAME } from '../../data/menu';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const menuItems = [
  { key: 'shop', label: 'Cửa hàng' },
  { key: 'cart', label: 'Giỏ hàng' },
  { key: 'checkout', label: 'Thanh toán' },
];

const Header = ({ currentPage, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();
  const { totalQuantity } = useCart();

  const handleNavClick = (event, key) => {
    event.preventDefault();
    onNavigate?.(key);
  };

  return (
    <Navbar bg={theme === 'dark' ? 'dark' : 'primary'} variant="dark" expand="md" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#" onClick={(e) => handleNavClick(e, 'shop')}>
          {APP_NAME}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            {menuItems.map(({ key, label }) => (
              <Nav.Link
                key={key}
                href={`#${key}`}
                active={currentPage === key}
                onClick={(e) => handleNavClick(e, key)}
              >
                {label}
                {key === 'cart' && totalQuantity > 0 && (
                  <Badge bg="warning" text="dark" className="ms-1">
                    {totalQuantity}
                  </Badge>
                )}
              </Nav.Link>
            ))}
          </Nav>
          <div className="d-flex align-items-center gap-2">
            <Button size="sm" variant="outline-light" onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Tối' : '☀️ Sáng'}
            </Button>
            {isLoggedIn ? (
              <>
                <Navbar.Text className="text-white">{`Xin chào, ${user.name}`}</Navbar.Text>
                <Button size="sm" variant="light" onClick={logout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <Button size="sm" variant="light" onClick={() => onNavigate?.('login')}>
                Đăng nhập
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

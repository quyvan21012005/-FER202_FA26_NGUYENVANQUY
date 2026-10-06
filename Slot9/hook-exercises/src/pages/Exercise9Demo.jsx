import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';

const Exercise9Demo = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, login, logout } = useAuth();

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Bài 9: Theme và Auth Context</span>
        <Button size="sm" variant={theme === 'dark' ? 'warning' : 'dark'} onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Chuyển sang Dark Theme' : '☀️ Chuyển sang Light Theme'}
        </Button>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <h5>1. Trạng thái Theme</h5>
          <p>
            Giao diện hiện tại đang ở chế độ: <strong>{theme.toUpperCase()}</strong> (thẻ bao quanh
            dùng <code>data-bs-theme="{theme}"</code>).
          </p>
        </div>

        <div>
          <h5 className="mb-3">2. Trạng thái Đăng nhập (AuthContext)</h5>
          {isLoggedIn ? (
            <Alert variant="success">
              <Alert.Heading>Xin chào, {user.name}!</Alert.Heading>
              <p>Bạn đã đăng nhập thành công với email: <strong>{user.email}</strong>.</p>
              <hr />
              <Button variant="danger" size="sm" onClick={logout}>
                Đăng xuất
              </Button>
            </Alert>
          ) : (
            <div>
              <p className="text-muted">Bạn chưa đăng nhập. Vui lòng đăng nhập bằng form dưới đây:</p>
              <LoginForm onLoginSuccess={login} />
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Exercise9Demo;

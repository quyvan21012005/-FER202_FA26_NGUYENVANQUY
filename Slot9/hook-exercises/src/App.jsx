import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import QuantityPicker from './components/QuantityPicker';
import MiniCart from './components/MiniCart';
import ProfilePreview from './components/ProfilePreview';
import ProductFilter from './components/ProductFilter';
import RegisterForm from './components/RegisterForm';
import ValidatedRegisterForm from './components/ValidatedRegisterForm';
import TodoList from './components/TodoList';
import CartDemoPage from './pages/CartDemoPage';
import LoginForm from './components/LoginForm';
import Exercise9Demo from './pages/Exercise9Demo';
import MiniShopApp from './pages/MiniShopApp';

import { products } from './data/products';

const EXERCISES = [
  { id: 'ex1', num: 'Bài 1', title: 'Bộ chọn số lượng & Giỏ hàng mini', hook: 'useState' },
  { id: 'ex2', num: 'Bài 2', title: 'Form hồ sơ xem trước trực tiếp', hook: 'Controlled Inputs' },
  { id: 'ex3', num: 'Bài 3', title: 'Tìm kiếm, lọc & sắp xếp sản phẩm', hook: 'Derived State' },
  { id: 'ex4', num: 'Bài 4', title: 'Form đăng ký có điều khiển', hook: 'State Object' },
  { id: 'ex5', num: 'Bài 5', title: 'Form đăng ký có validation', hook: 'Regex & onBlur' },
  { id: 'ex6', num: 'Bài 6', title: 'Todo List', hook: 'Array Immutability' },
  { id: 'ex7', num: 'Bài 7', title: 'Giỏ hàng với useReducer', hook: 'useReducer' },
  { id: 'ex8', num: 'Bài 8', title: 'Form đăng nhập (Async)', hook: 'useReducer Async' },
  { id: 'ex9', num: 'Bài 9', title: 'Theme sáng/tối & Auth Context', hook: 'useContext' },
  { id: 'ex10', num: 'Bài 10', title: 'Cửa hàng mini tổng hợp', hook: 'Context + Reducer' },
];

const MainShowcase = () => {
  const [activeTab, setActiveTab] = useState('ex10');
  const { theme } = useTheme();

  return (
    <div data-bs-theme={theme} className="bg-body text-body min-vh-100">
      {/* Top Navbar for testing all 10 exercises */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-2">
        <Container fluid className="px-3">
          <Navbar.Brand className="fw-bold d-flex align-items-center gap-2">
            <span>⚛️ FER202 – Hook Lab</span>
            <Badge bg="info" text="dark">Slot 9</Badge>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="exercise-nav" />
          <Navbar.Collapse id="exercise-nav">
            <Nav className="ms-auto flex-wrap">
              {EXERCISES.map((ex) => (
                <Nav.Link
                  key={ex.id}
                  active={activeTab === ex.id}
                  onClick={() => setActiveTab(ex.id)}
                  className={`px-2 py-1 small rounded mx-1 my-1 ${
                    activeTab === ex.id ? 'bg-primary text-white fw-bold' : 'text-light'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  {ex.num}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Render selected exercise */}
      {activeTab === 'ex10' ? (
        <MiniShopApp />
      ) : (
        <Container className="py-4">
          <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 className="mb-1">
                {EXERCISES.find((e) => e.id === activeTab)?.num}:{' '}
                {EXERCISES.find((e) => e.id === activeTab)?.title}
              </h3>
              <Badge bg="secondary">
                Trọng tâm: {EXERCISES.find((e) => e.id === activeTab)?.hook}
              </Badge>
            </div>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setActiveTab('ex10')}
            >
              🚀 Mở Bài 10 (Cửa hàng tổng hợp)
            </button>
          </div>

          {activeTab === 'ex1' && (
            <div className="d-flex flex-column gap-4">
              <Card className="shadow-sm">
                <Card.Header as="h6">Phần 1. Bộ chọn số lượng (QuantityPicker)</Card.Header>
                <Card.Body>
                  <p className="text-muted small mb-3">
                    Thử nghiệm functional update và kẹp min-max. Component 1 mặc định (min 1, max 10),
                    Component 2 (min 2, max 5).
                  </p>
                  <div className="d-flex flex-column gap-3">
                    <div>
                      <div className="small text-muted mb-1">Mặc định (1 – 10):</div>
                      <QuantityPicker />
                    </div>
                    <div>
                      <div className="small text-muted mb-1">Giới hạn tùy chỉnh (2 – 5):</div>
                      <QuantityPicker min={2} max={5} />
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Header as="h6">Phần 2. Giỏ hàng mini (MiniCart)</Card.Header>
                <Card.Body>
                  <p className="text-muted small mb-3">
                    State mảng object, cập nhật số lượng bất biến với <code>map()</code>, tính tổng tiền
                    dẫn xuất qua <code>reduce()</code>.
                  </p>
                  <MiniCart />
                </Card.Body>
              </Card>
            </div>
          )}

          {activeTab === 'ex2' && (
            <Card className="shadow-sm">
              <Card.Header as="h6">Form hồ sơ xem trước trực tiếp</Card.Header>
              <Card.Body>
                <Alert variant="light" className="border small mb-4">
                  💡 Nhấn <strong>Esc</strong> trong ô Họ tên để xóa nhanh. Nhập quá 150 ký tự trong ô
                  giới thiệu sẽ tự động cắt bớt và bộ đếm chuyển sang màu đỏ khi còn dưới 20 ký tự.
                </Alert>
                <ProfilePreview />
              </Card.Body>
            </Card>
          )}

          {activeTab === 'ex3' && (
            <Card className="shadow-sm">
              <Card.Header as="h6">Tìm kiếm, lọc và sắp xếp sản phẩm</Card.Header>
              <Card.Body>
                <ProductFilter products={products} />
              </Card.Body>
            </Card>
          )}

          {activeTab === 'ex4' && (
            <Card className="shadow-sm">
              <Card.Header as="h6">Form đăng ký có điều khiển (Một handleChange duy nhất)</Card.Header>
              <Card.Body>
                <RegisterForm />
              </Card.Body>
            </Card>
          )}

          {activeTab === 'ex5' && (
            <Card className="shadow-sm">
              <Card.Header as="h6">Form đăng ký có validation (Touched + Regex + onBlur)</Card.Header>
              <Card.Body>
                <ValidatedRegisterForm />
              </Card.Body>
            </Card>
          )}

          {activeTab === 'ex6' && (
            <div className="py-2">
              <TodoList />
            </div>
          )}

          {activeTab === 'ex7' && (
            <Card className="shadow-sm">
              <Card.Header as="h6">Giỏ hàng với useReducer (Tách logic reducer & selector)</Card.Header>
              <Card.Body>
                <CartDemoPage />
              </Card.Body>
            </Card>
          )}

          {activeTab === 'ex8' && (
            <Card className="shadow-sm">
              <Card.Header as="h6">Form đăng nhập với useReducer (Giả lập Async API & Spinner)</Card.Header>
              <Card.Body>
                <LoginForm />
              </Card.Body>
            </Card>
          )}

          {activeTab === 'ex9' && (
            <Exercise9Demo />
          )}
        </Container>
      )}
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <CartProvider>
        <MainShowcase />
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;

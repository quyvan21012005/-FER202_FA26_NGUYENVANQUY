import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

// ES6: Import gom nhóm từ components và data
import { ProductList, AppButton, InputField } from '../components';
import { products } from '../data/products';
import { APP_NAME } from '../data/menu';

const HomePage = () => {
  // ES6: filter, spread, sort, slice, Set
  const onSale = products.filter(({ discount }) => discount > 0);
  const deals = [...onSale].sort((a, b) => b.discount - a.discount).slice(0, 4);
  const categories = ['Tất cả', ...new Set(products.map((p) => p.category?.name).filter(Boolean))];

  // ES6: reduce, Math.round, object shorthand
  const total = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const avgPrice = Math.round(products.reduce((sum, p) => sum + p.price, 0) / total);

  // ES6: destructuring từ object stats
  const stats = { total, inStockCount, avgPrice };
  const { total: totalProducts, inStockCount: available, avgPrice: average } = stats;

  const statCards = [
    { label: 'Tổng sản phẩm', value: totalProducts },
    { label: 'Còn hàng', value: available },
    { label: 'Giá trung bình', value: average.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) },
  ];

  return (
    <div className="d-flex flex-column gap-5 mb-5">
      {/* 1. Hero Block */}
      <Card className="bg-primary text-white text-center p-4 shadow-sm border-0">
        <Card.Body>
          <h1>{`Chào mừng đến ${APP_NAME}`}</h1>
          <p className="lead mb-0">{`Hôm nay có ${onSale.length} sản phẩm đang giảm giá`}</p>
        </Card.Body>
      </Card>

      {/* 2. Thống kê */}
      <Row className="g-3">
        {statCards.map(({ label, value }) => (
          <Col key={label} md={4}>
            <Card className="text-center shadow-sm h-100">
              <Card.Body>
                <h6 className="text-muted">{label}</h6>
                <h3 className="fw-bold text-primary m-0">{value}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 3. Bộ lọc */}
      <Card className="p-3 shadow-sm">
        <InputGroup>
          <Form.Control placeholder="Tìm sản phẩm..." />
          <Form.Select>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
          <AppButton>Tìm</AppButton>
        </InputGroup>
      </Card>

      {/* 4. Đang giảm giá */}
      <div>
        <h3 className="text-danger fw-bold mb-3">🔥 Đang giảm giá</h3>
        <ProductList products={deals} />
      </div>

      {/* 5. Tất cả sản phẩm */}
      <div>
        <h3 className="fw-bold mb-3">📦 Tất cả sản phẩm</h3>
        {products.length === 0 ? (
          <Alert variant="info">Chưa có sản phẩm</Alert>
        ) : (
          <ProductList products={products} />
        )}
      </div>

      {/* 6. Nhận tin */}
      <Card className="p-4 shadow-sm bg-light">
        <h4 className="text-center mb-3">Đăng ký nhận thông tin khuyến mãi</h4>
        <Form onSubmit={(e) => e.preventDefault()} className="d-flex justify-content-center gap-2">
          <div style={{ maxWidth: 400 }} className="flex-grow-1">
            <InputField
              id="newsletter-email"
              type="email"
              placeholder="Nhập email của bạn..."
              required
            />
          </div>
          <div>
            <AppButton type="submit">Đăng ký</AppButton>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default HomePage;
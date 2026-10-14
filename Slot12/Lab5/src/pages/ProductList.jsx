import { Row, Col, Badge } from 'react-bootstrap';
import { products } from '../data/products';
import MyProduct from '../components/MyProduct';

function ProductList() {
  return (
    <div className="py-3">
      {/* Tiêu đề trang danh sách sản phẩm */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h2 fw-bold text-primary mb-1">
            Bộ Sưu Tập Áo Bóng Đá
          </h1>
          <p className="text-muted mb-0">
            Chính hãng, chất lượng cao, thoáng mát và co giãn thể thao chuyên dụng
          </p>
        </div>
        <div>
          <Badge bg="primary" pill className="fs-6 px-3 py-2">
            Tổng cộng: {products.length} sản phẩm
          </Badge>
        </div>
      </div>

      {/* Hiển thị danh sách sản phẩm dùng phương thức .map() */}
      <Row className="g-4">
        {products.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
            <MyProduct product={item} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ProductList;
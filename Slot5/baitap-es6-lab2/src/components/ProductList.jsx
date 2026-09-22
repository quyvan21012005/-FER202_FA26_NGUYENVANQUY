import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ProductCard from './ProductCard';

const ProductList = ({ products = [] }) => {
  const categories = ['Tất cả', ...new Set(products.map((p) => p.category?.name).filter(Boolean))];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">{`Có ${products.length} sản phẩm`}</h5>
        <div className="d-flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button key={cat} variant="outline-primary" size="sm">
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <Row xs={1} md={2} lg={4} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;
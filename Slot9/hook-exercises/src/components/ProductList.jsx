import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from './ProductCard';

const ProductList = ({ products = [], onAddToCart }) => (
  <Row xs={1} sm={2} md={3} lg={4} className="g-3">
    {products.map((product) => (
      <Col key={product.id}>
        <ProductCard product={product} onAddToCart={onAddToCart} />
      </Col>
    ))}
  </Row>
);

export default ProductList;

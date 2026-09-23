import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from './components/ProductCard';

const productA = {
  id: 1,
  name: 'Tai nghe Bluetooth',
  price: 590000,
  image: 'https://picsum.photos/seed/headphone/300/200',
  rating: { rate: 4.5, count: 120 },
  category: { name: 'Âm thanh' },
};
const productB = { id: 2, name: 'Chuột không dây', price: 0 };
const productC = { id: 3 };

function App() {
  return (
    <div className="container my-5">
      <h3 className="mb-4">Bài 3: ProductCard an toàn dữ liệu</h3>
      <Row>
        <Col md={4}><ProductCard product={productA} /></Col>
        <Col md={4}><ProductCard product={productB} /></Col>
        <Col md={4}><ProductCard product={productC} /></Col>
      </Row>
    </div>
  );
}

export default App;
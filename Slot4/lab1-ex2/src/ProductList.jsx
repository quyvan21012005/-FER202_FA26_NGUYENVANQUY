import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductInfo from './ProductInfo';

function ProductList() {
  // Danh sách dữ liệu mẫu các loại Pizza
  const pizzas = [
    {
      id: 1,
      name: "Pizza Hải Sản Cao Cấp",
      price: 18,
      tag: "Hot",
      avatar: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"
    },
    {
      id: 2,
      name: "Pizza Phô Mai 4 Vị",
      price: 15,
      tag: "Sale",
      avatar: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"
    },
    {
      id: 3,
      name: "Pizza Bò Nướng Tiêu Đen",
      price: 16,
      tag: "New",
      avatar: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400"
    },
    {
      id: 4,
      name: "Pizza Xúc Xích Pepperoni",
      price: 14,
      tag: "Popular",
      avatar: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400"
    }
  ];

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 text-primary fw-bold">Menu Pizza Cửa Hàng</h2>
      <Row className="g-4">
        {pizzas.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
            <ProductInfo
              name={item.name}
              price={item.price}
              tag={item.tag}
              avatar={item.avatar}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductList;
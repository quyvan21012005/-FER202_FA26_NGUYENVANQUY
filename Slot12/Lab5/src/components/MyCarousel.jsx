import { Carousel, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { banners } from '../data/banners';

function MyCarousel() {
  return (
    <Carousel interval={3500} pause="hover" className="mb-4 shadow-sm rounded-4 overflow-hidden border bg-white">
      {banners.map((banner) => (
        <Carousel.Item key={banner.id}>
          <div
            className="p-4 p-md-5 d-flex align-items-center"
            style={{
              minHeight: '380px',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}
          >
            <Row className="w-100 align-items-center justify-content-center mx-0">
              {/* Cột thông tin bên trái - không lo bị che chữ */}
              <Col xs={12} md={7} className="text-center text-md-start pe-md-4 mb-3 mb-md-0">
                <Badge bg="primary" className="mb-2 px-3 py-2 text-uppercase fw-semibold">
                  Bộ Sưu Tập Mới
                </Badge>
                <h2 className="display-6 fw-bold text-dark mb-2">
                  {banner.title}
                </h2>
                <p className="lead text-secondary fs-6 mb-4">
                  {banner.description}
                </p>
                <Button as={Link} to="/products" variant="primary" className="px-4 py-2 fw-semibold shadow-sm">
                  Xem ngay &rarr;
                </Button>
              </Col>

              {/* Cột ảnh áo bóng đá bên phải - hiển thị trọn vẹn và đẹp mắt */}
              <Col xs={12} md={5} className="text-center">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="img-fluid rounded-3 shadow bg-white p-2"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </Col>
            </Row>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default MyCarousel;

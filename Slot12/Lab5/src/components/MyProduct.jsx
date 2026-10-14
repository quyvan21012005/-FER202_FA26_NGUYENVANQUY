import { Card, Badge, Button } from 'react-bootstrap';

function MyProduct({ product }) {
  if (!product) return null;

  const {
    id,
    name,
    description,
    price,
    discount = 0,
    instock,
    rating,
    category,
    image
  } = product;

  // Tính giá sau khi áp dụng giảm giá
  const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

  return (
    <Card className="h-100 shadow-sm border-0 position-relative product-card overflow-hidden">
      {/* Badge giảm giá góc trên ảnh */}
      {discount > 0 && (
        <Badge
          bg="danger"
          className="position-absolute top-0 end-0 m-2 px-2 py-1 shadow-sm"
          style={{ zIndex: 1 }}
        >
          -{discount}%
        </Badge>
      )}

      {/* Ảnh sản phẩm */}
      <div className="bg-light text-center overflow-hidden" style={{ height: '240px' }}>
        <Card.Img
          variant="top"
          src={image}
          alt={name}
          className="w-100 h-100"
          style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
        />
      </div>

      <Card.Body className="d-flex flex-column p-3">
        {/* Phân loại & Đánh giá */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Badge bg="secondary" className="fw-normal">
            {category}
          </Badge>
          <span className="small text-warning fw-bold">
            ★ {rating} <span className="text-muted fw-normal">({id})</span>
          </span>
        </div>

        {/* Tên sản phẩm */}
        <Card.Title
          as="h3"
          className="h6 fw-bold text-dark text-truncate mb-2"
          title={name}
        >
          {name}
        </Card.Title>

        {/* Mô tả sản phẩm */}
        <Card.Text
          className="text-muted small flex-grow-1 mb-3"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {description}
        </Card.Text>

        {/* Trạng thái tồn kho */}
        <div className="mb-2">
          {instock > 0 ? (
            <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25">
              ● Còn hàng ({instock} áo)
            </Badge>
          ) : (
            <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-25">
              ● Hết hàng
            </Badge>
          )}
        </div>

        {/* Giá sản phẩm */}
        <div className="d-flex align-items-baseline gap-2 mb-3">
          <span className="fs-5 fw-bold text-danger">
            {finalPrice.toLocaleString('vi-VN')} đ
          </span>
          {discount > 0 && (
            <span className="text-muted text-decoration-line-through small">
              {price.toLocaleString('vi-VN')} đ
            </span>
          )}
        </div>

        {/* Nút đặt mua */}
        <Button
          variant="primary"
          size="sm"
          className="w-100 fw-semibold mt-auto"
          disabled={instock <= 0}
        >
          {instock > 0 ? 'Thêm vào giỏ' : 'Tạm hết hàng'}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MyProduct;
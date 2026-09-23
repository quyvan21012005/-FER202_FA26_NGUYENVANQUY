import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

const ProductCard = ({ product }) => {
  const {
    name = 'Sản phẩm chưa đặt tên',
    price,
    image,
    rating,
    category,
    inStock = true,
    discount = 0,
  } = product ?? {};

  const imageSrc = image ?? 'https://placehold.co/300x200?text=No+Image';
  const categoryName = category?.name ?? 'Chưa phân loại';
  const rateValue = rating?.rate ?? 'Chưa có';
  const rateCount = rating?.count ?? 0;

  const finalPrice = typeof price === 'number' ? price * (1 - discount / 100) : null;

  return (
    <Card className={`h-100 position-relative shadow-sm ${inStock ? '' : 'opacity-50'}`}>
      {discount > 0 && (
        <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
          -{discount}%
        </Badge>
      )}
      <Card.Img variant="top" src={imageSrc} style={{ height: 180, objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Badge bg="info">{categoryName}</Badge>
            {inStock ? <Badge bg="success">Còn hàng</Badge> : <Badge bg="secondary">Hết hàng</Badge>}
          </div>

          <Card.Title className="fs-6">{name}</Card.Title>

          <div className="mb-2">
            {discount > 0 && typeof price === 'number' ? (
              <>
                <span className="text-danger fw-bold me-2">
                  {finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
                <del className="text-muted small">
                  {price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </del>
              </>
            ) : (
              <span className="fw-bold">
                {price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) ?? 'Liên hệ'}
              </span>
            )}
          </div>

          <div className="small text-muted mb-2">
            ⭐ {rateValue} ({rateCount} đánh giá){' '}
            {rating?.rate >= 4.5 && <Badge bg="warning" text="dark">Bán chạy</Badge>}
          </div>
        </div>

        <Button variant="primary" className="mt-2 w-100" disabled={!inStock}>
          {inStock ? 'Thêm vào giỏ' : 'Không khả dụng'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
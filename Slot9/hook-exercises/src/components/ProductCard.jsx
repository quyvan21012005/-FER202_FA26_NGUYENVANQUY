import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { formatVND, getFinalPrice } from '../utils/format';

const ProductCard = ({ product, onAddToCart }) => {
  const {
    name = 'Sản phẩm chưa đặt tên',
    price = 0,
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
  const finalPrice = getFinalPrice({ price, discount });

  return (
    <Card className={`h-100 position-relative shadow-sm ${inStock ? '' : 'opacity-75'}`}>
      {discount > 0 && (
        <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
          -{discount}%
        </Badge>
      )}
      <Card.Img variant="top" src={imageSrc} style={{ height: 160, objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Badge bg="info">{categoryName}</Badge>
            {inStock ? <Badge bg="success">Còn hàng</Badge> : <Badge bg="secondary">Hết hàng</Badge>}
          </div>

          <Card.Title className="fs-6 mb-2">{name}</Card.Title>

          <div className="mb-2">
            {discount > 0 ? (
              <>
                <span className="text-danger fw-bold me-2">{formatVND(finalPrice)}</span>
                <del className="text-muted small">{formatVND(price)}</del>
              </>
            ) : (
              <span className="fw-bold">{formatVND(price)}</span>
            )}
          </div>

          <div className="small text-muted mb-3">
            ⭐ {rateValue} ({rateCount} đánh giá)
          </div>
        </div>

        <Button
          variant="primary"
          className="mt-auto w-100"
          disabled={!inStock}
          onClick={() => onAddToCart?.(product)}
        >
          {inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

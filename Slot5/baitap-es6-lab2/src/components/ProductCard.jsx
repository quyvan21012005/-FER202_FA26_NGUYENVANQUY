import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

const ProductCard = ({ product }) => {
  const {
    name = 'Sản phẩm chưa đặt tên',
    price,
    image,
    rating,
    category,
  } = product ?? {};

  const imageSrc = image ?? 'https://placehold.co/300x200?text=No+Image';
  const categoryName = category?.name ?? 'Chưa phân loại';
  const rateValue = rating?.rate ?? 'Chưa có';
  const rateCount = rating?.count ?? 0;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={imageSrc} style={{ height: 180, objectFit: 'cover' }} />
      <Card.Body>
        <Badge bg="info" className="mb-2">{categoryName}</Badge>
        <Card.Title className="fs-6">{name}</Card.Title>
        <Card.Text className="fw-bold text-danger">
          {price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) ?? 'Liên hệ'}
        </Card.Text>
        <small className="text-muted">⭐ {rateValue} ({rateCount} đánh giá)</small>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
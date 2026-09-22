import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

function ProductInfo({ name, price, tag, avatar }) {
  return (
    <Card className="h-100 shadow-sm position-relative">
      <Card.Img 
        variant="top" 
        src={avatar} 
        style={{ height: '180px', objectFit: 'cover' }} 
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title>{name}</Card.Title>
          <Card.Text className="text-muted fw-bold">
            Price: ${price}
          </Card.Text>
        </div>
        <Button variant="primary" className="mt-2">Buy Now</Button>
        {tag && (
          <Badge 
            bg="danger" 
            pill 
            style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}
          >
            {tag}
          </Badge>
        )}
      </Card.Body>
    </Card>
  );
}

export default ProductInfo;
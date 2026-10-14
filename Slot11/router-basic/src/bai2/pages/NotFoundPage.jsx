import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="py-5 text-center">
      <Card className="border-0 shadow-sm p-4 p-md-5 mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body>
          <h1 className="display-1 fw-bold text-danger mb-2">404</h1>
          <h3 className="fw-bold mb-3">Không Tìm Thấy Trang</h3>
          <p className="text-muted mb-4">
            Đường dẫn bạn yêu cầu không tồn tại trong hệ thống Thư viện FPT University.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/" variant="primary">
              🏠 Về trang chủ
            </Button>
            <Button as={Link} to="/books" variant="outline-primary">
              📚 Xem danh sách sách
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NotFoundPage;

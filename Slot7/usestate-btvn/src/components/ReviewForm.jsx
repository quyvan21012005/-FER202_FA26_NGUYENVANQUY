import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import StarRating from './StarRating';

export default function ReviewForm() {
  // 3 state cơ bản theo đúng yêu cầu đề bài
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

  // Dữ liệu dẫn xuất (Derived state):
  // Nút gửi chỉ bấm được khi đã chọn sao (> 0) và nhận xét ít nhất 5 ký tự
  const canSubmit = rating > 0 && comment.trim().length >= 5;

  // Tính điểm trung bình dẫn xuất bằng reduce, làm tròn 1 chữ số thập phân
  const average =
    reviews.length === 0
      ? '0.0'
      : (
          reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
        ).toFixed(1);

  // Xử lý gửi đánh giá
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Thêm đánh giá mới vào ĐẦU danh sách (sao chép mảng bất biến [...prev])
    setReviews((prev) => [
      {
        id: Date.now(),
        rating,
        comment: comment.trim(),
        createdAt: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      ...prev,
    ]);

    // Reset form về trạng thái ban đầu
    setRating(0);
    setComment('');
  };

  return (
    <Container className="py-4" style={{ maxWidth: '700px' }}>
      {/* Tiêu đề ứng dụng và thống kê trung bình */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Bài 2: Đánh giá sao & Nhận xét</h2>
        <h5 className="text-muted mt-2">
          Trung bình <span className="text-warning fw-bold">{average}</span>/5 (
          <span className="fw-bold text-dark">{reviews.length}</span> lượt)
        </h5>
      </div>

      {/* Form đánh giá */}
      <Card className="p-4 mb-4 bg-white shadow-sm border">
        <Form onSubmit={handleSubmit}>
          {/* Component đánh giá sao có điều khiển */}
          <div className="text-center mb-3">
            <Form.Label className="d-block fw-semibold mb-2 text-dark">
              Chọn mức độ hài lòng của bạn:
            </Form.Label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Ô nhập nhận xét */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              Nhận xét của bạn (tối thiểu 5 ký tự):
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm/dịch vụ..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ resize: 'none' }}
            />
            <div className="d-flex justify-content-between mt-1">
              <small
                className={
                  comment.trim().length >= 5 ? 'text-success' : 'text-danger'
                }
              >
                {comment.trim().length}/5 ký tự tối thiểu
              </small>
              {rating === 0 && (
                <small className="text-danger">* Vui lòng chọn số sao</small>
              )}
            </div>
          </Form.Group>

          {/* Nút gửi đánh giá */}
          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!canSubmit}
              className="fw-semibold"
            >
              Gửi đánh giá
            </Button>
          </div>
        </Form>
      </Card>

      {/* Danh sách các đánh giá đã gửi */}
      <div className="review-list">
        <h5 className="fw-bold text-dark mb-3">
          Danh sách nhận xét ({reviews.length})
        </h5>

        {reviews.length === 0 ? (
          <Alert variant="light" className="text-center text-muted border py-4">
            Chưa có đánh giá nào. Hãy là người đầu tiên để lại nhận xét!
          </Alert>
        ) : (
          <div className="d-flex flex-column gap-3">
            {reviews.map((item) => (
              <Card key={item.id} className="shadow-sm border">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    {/* Hiển thị sao vàng và sao xám */}
                    <div>
                      <span className="text-warning fs-5">
                        {'★'.repeat(item.rating)}
                      </span>
                      <span className="text-muted opacity-25 fs-5">
                        {'★'.repeat(5 - item.rating)}
                      </span>
                      <Badge bg="light" text="dark" className="ms-2 border">
                        {item.rating}/5 sao
                      </Badge>
                    </div>
                    <small className="text-muted">{item.createdAt}</small>
                  </div>
                  <Card.Text className="text-dark mb-0 fs-6">
                    {item.comment}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

import React, { useState } from 'react';
import { Container, Card, Form, Button, ListGroup } from 'react-bootstrap';
import StarRating from './StarRating';

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

  // Dữ liệu dẫn xuất: kiểm tra điều kiện nút gửi
  const canSubmit = rating > 0 && comment.trim().length >= 5;

  // Dữ liệu dẫn xuất: tính trung bình số sao (tránh chia cho 0)
  const average =
    reviews.length === 0
      ? '0.0'
      : (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1);

  // Xử lý gửi đánh giá
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const newReview = {
      id: Date.now(),
      rating,
      comment: comment.trim(),
    };

    // Thêm đánh giá mới vào ĐẦU danh sách bằng updater function
    setReviews((prev) => [newReview, ...prev]);

    // Reset form về trạng thái ban đầu
    setRating(0);
    setComment('');
  };

  return (
    <Container className="my-4" style={{ maxWidth: '650px' }}>
      <Card className="p-4 shadow-sm mb-4">
        <h3 className="mb-2">Bài 2: Đánh giá sao</h3>
        <p className="text-secondary mb-4">
          Trung bình: <strong>{average}/5</strong> ({reviews.length} lượt đánh giá)
        </p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Chọn số sao:</Form.Label>
            {/* Truyền value và trực tiếp hàm setRating làm onChange */}
            <StarRating value={rating} onChange={setRating} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Nhận xét (ít nhất 5 ký tự):</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập cảm nhận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={!canSubmit}>
            Gửi đánh giá
          </Button>
        </Form>
      </Card>

      {/* Danh sách nhận xét */}
      <h5 className="mb-3">Tất cả nhận xét ({reviews.length})</h5>
      {reviews.length === 0 ? (
        <p className="text-muted">Chưa có nhận xét nào.</p>
      ) : (
        <ListGroup>
          {reviews.map((rev) => (
            <ListGroup.Item key={rev.id} className="py-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span style={{ fontSize: '1.2rem' }}>
                  <span style={{ color: '#ffc107' }}>{'★'.repeat(rev.rating)}</span>
                  <span style={{ color: '#e4e5e9' }}>{'★'.repeat(5 - rev.rating)}</span>
                </span>
                <small className="text-muted">Mới nhất</small>
              </div>
              <div style={{ wordBreak: 'break-word' }}>{rev.comment}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}
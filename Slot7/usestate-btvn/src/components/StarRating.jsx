import React, { useState } from 'react';

// Nhãn mô tả tương ứng từ 0 đến 5 sao
const LABELS = ['Chưa đánh giá', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

export default function StarRating({ value = 0, onChange, max = 5 }) {
  // State thuần giao diện: Vị trí sao đang được rê chuột (0 là không rê chuột)
  // Lưu ý: StarRating không tự lưu điểm đã chọn mà nhận qua props value
  const [hovered, setHovered] = useState(0);

  // Đang rê chuột thì ưu tiên hiển thị hovered, không thì hiển thị value đã chọn
  const display = hovered || value;

  return (
    <div
      className="d-inline-flex flex-column align-items-center"
      onMouseLeave={() => setHovered(0)}
    >
      {/* Hàng 5 ngôi sao */}
      <div
        className="d-flex align-items-center gap-1"
        style={{ fontSize: '36px', cursor: 'pointer', userSelect: 'none' }}
      >
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <span
            key={star}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star === value ? 0 : star)}
            style={{
              color: star <= display ? '#ffc107' : '#dee2e6',
              transition: 'color 0.15s ease-in-out',
            }}
          >
            ★
          </span>
        ))}
      </div>

      {/* Nhãn mô tả cảm xúc đánh giá */}
      <span className="text-secondary small mt-1 fw-semibold">
        {LABELS[display] || LABELS[0]}
      </span>
    </div>
  );
}

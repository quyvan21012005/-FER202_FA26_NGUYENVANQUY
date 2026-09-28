import React, { useState } from 'react';

// Danh sách nhãn mô tả tương ứng từ 0 đến 5 sao
const LABELS = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

export default function StarRating({ value = 0, onChange, max = 5 }) {
  // State giao diện cục bộ: lưu ngôi sao đang được rê chuột tới
  const [hovered, setHovered] = useState(0);

  // Đang rê chuột thì ưu tiên hovered, nếu không thì hiển thị value đã chọn
  const display = hovered || value;

  return (
    <div
      className="d-flex align-items-center gap-2"
      onMouseLeave={() => setHovered(0)}
    >
      <div>
        {Array.from({ length: max }, (_, index) => {
          const star = index + 1;
          const isFilled = star <= display;

          return (
            <span
              key={star}
              role="button"
              style={{
                fontSize: '2rem',
                cursor: 'pointer',
                color: isFilled ? '#ffc107' : '#e4e5e9',
                userSelect: 'none',
                transition: 'color 0.15s ease-in-out',
              }}
              onMouseEnter={() => setHovered(star)}
              onClick={() => onChange(star === value ? 0 : star)}
            >
              ★
            </span>
          );
        })}
      </div>
      <span className="text-muted fw-semibold" style={{ minWidth: '100px' }}>
        {LABELS[display] || 'Chưa đánh giá'}
      </span>
    </div>
  );
}